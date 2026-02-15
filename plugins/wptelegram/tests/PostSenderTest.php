<?php
/**
 * Integration tests for PostSender.
 *
 * All tests go through send_post() and verify observable outcomes:
 * API calls made, request params, post meta, actions/filters fired, cron events.
 *
 * @package WPTelegram\Tests
 *
 * @phpcs:disable Squiz.Commenting.FunctionComment, Squiz.Commenting.ClassComment
 */

use WPTelegram\Core\modules\p2tg\PostSender;
use WPTelegram\Core\modules\p2tg\Main as P2tgMain;
use WPTelegram\Tests\Helpers\PostSenderHelper;

class PostSenderTest extends WP_UnitTestCase {

	public function setUp(): void {
		parent::setUp();

		PostSenderHelper::reset_all();
		PostSenderHelper::setup_options();
		PostSenderHelper::mock_telegram_api();

		// Simulate a POST request context for RequestCheck::is_post_request().
		$_SERVER['REQUEST_METHOD'] = 'POST';
	}

	public function tearDown(): void {
		PostSenderHelper::clear_telegram_api_mock();

		// Clean up superglobals.
		unset( $_GET['bulk_edit'] );
		unset( $_REQUEST['action'] );
		unset( $_POST['_wptg_p2tg_is_gb_metabox'] );
		unset( $_POST['_wptg_p2tg_from_web'] );
		unset( $_POST['_wptg_p2tg_send2tg'] );
		unset( $_POST['_wptg_p2tg_override_switch'] );
		unset( $_POST['nonce__wptelegram'] );
		unset( $_SERVER['REQUEST_METHOD'] );

		parent::tearDown();
	}

	/**
	 * Helper: create a published post and return it.
	 */
	private function create_post( array $args = [] ): WP_Post {
		$defaults = [
			'post_title'   => 'Test Post',
			'post_content' => 'Test content for the post.',
			'post_status'  => 'publish',
			'post_type'    => 'post',
		];

		$post_id = $this->factory()->post->create( array_merge( $defaults, $args ) );

		return get_post( $post_id );
	}

	/**
	 * Helper: get a fresh PostSender instance.
	 */
	private function get_sender(): PostSender {
		return PostSender::instance();
	}

	// ──────────────────────────────────────────────────
	// A. Entry points and lifecycle (5 tests)
	// ──────────────────────────────────────────────────

	public function test_send_post_returns_early_for_null_post(): void {
		$before_fired = false;
		add_action(
			'wptelegram_p2tg_before_send_post',
			function () use ( &$before_fired ) {
				$before_fired = true;
			}
		);

		$result = $this->get_sender()->send_post( null );

		$this->assertFalse( $before_fired );
		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_send_post_fires_lifecycle_actions(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$events = [];
		add_action(
			'wptelegram_p2tg_before_send_post',
			function ( $result, $post, $trigger, $force ) use ( &$events ) {
				$events[] = [
					'action'  => 'before',
					'trigger' => $trigger,
					'force'   => $force,
				];
			},
			10,
			4
		);
		add_action(
			'wptelegram_p2tg_after_send_post',
			function ( $result, $post, $trigger, $force ) use ( &$events ) {
				$events[] = [
					'action'  => 'after',
					'trigger' => $trigger,
					'force'   => $force,
				];
			},
			10,
			4
		);

		$this->get_sender()->send_post( $post, 'non_wp', true );

		$this->assertCount( 2, $events );
		$this->assertSame( 'before', $events[0]['action'] );
		$this->assertSame( 'non_wp', $events[0]['trigger'] );
		$this->assertTrue( $events[0]['force'] );
		$this->assertSame( 'after', $events[1]['action'] );
	}

	public function test_delayed_trigger_sets_up_and_restores_postdata(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$original = $this->create_post( [ 'post_title' => 'Original Global' ] );
		// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		$GLOBALS['post'] = $original;

		/**
		 * Capture the value of $GLOBALS['post'] during the delayed_post processing.
		 *
		 * @var WP_Post|null $captured_global
		 */
		$captured_global = null;
		add_action(
			'wptelegram_p2tg_post_init',
			function () use ( &$captured_global ) {
				$captured_global = $GLOBALS['post'] ?? null;
			}
		);

		$this->get_sender()->send_post( $post, 'delayed_post' );

		// During processing, $GLOBALS['post'] should have been set to $post.
		$this->assertSame( $post->ID, $captured_global->ID );
		// After processing, $GLOBALS['post'] should be restored.
		$this->assertSame( $original->ID, $GLOBALS['post']->ID );
	}

	public function test_delayed_post_skips_nonexistent_post(): void {
		$this->get_sender()->delayed_post( 999999 );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_future_to_publish_respects_filter(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		add_filter( 'wptelegram_p2tg_send_scheduled_posts', '__return_false' );

		$this->get_sender()->future_to_publish( $post );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	// ──────────────────────────────────────────────────
	// B. Early exits in send_the_post (6 tests)
	// ──────────────────────────────────────────────────

	public function test_returns_early_when_bot_token_empty(): void {
		PostSenderHelper::setup_options( [], [ 'bot_token' => '' ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$this->get_sender()->send_post( $post );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );
		$this->assertEmpty( get_post_meta( $post->ID, '_wptg_p2tg_sent2tg', true ) );
	}

	public function test_skips_already_processed_post(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$sender = $this->get_sender();
		$sender->send_post( $post, 'non_wp' );
		$first_count = count( PostSenderHelper::get_intercepted_requests() );

		// Reset module instances to get a fresh PostSender but keep processed_posts.
		PostSenderHelper::reset_module_instances();
		PostSenderHelper::reset_request_check();
		PostSenderHelper::reset_admin_saved_options();

		$this->get_sender()->send_post( $post, 'non_wp' );

		$this->assertSame( $first_count, count( PostSenderHelper::get_intercepted_requests() ) );
	}

	public function test_processed_posts_reset_allows_resend(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$this->get_sender()->send_post( $post, 'non_wp' );
		$first_count = count( PostSenderHelper::get_intercepted_requests() );
		$this->assertGreaterThan( 0, $first_count );

		// Full reset including processed_posts.
		PostSenderHelper::reset_all();
		PostSenderHelper::setup_options();
		PostSenderHelper::mock_telegram_api();

		$this->get_sender()->send_post( $post, 'non_wp' );

		$this->assertGreaterThan( $first_count, count( PostSenderHelper::get_intercepted_requests() ) );
	}

	public function test_no_channels_sets_send2tg_to_no(): void {
		PostSenderHelper::setup_options( [ 'channels' => [] ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$this->get_sender()->send_post( $post );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_fires_post_finish_action(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$captured = null;
		add_action(
			'wptelegram_p2tg_post_finish',
			function ( $p, $trigger, $ok, $options, $processed ) use ( &$captured ) {
				$captured = [
					'p'         => $p,
					'trigger'   => $trigger,
					'ok'        => $ok,
					'options'   => $options,
					'processed' => $processed,
				];
			},
			10,
			5
		);

		$this->get_sender()->send_post( $post, 'non_wp' );

		$this->assertNotNull( $captured );
		$this->assertSame( $post->ID, $captured['p']->ID );
		$this->assertSame( 'non_wp', $captured['trigger'] );
		$this->assertTrue( $captured['ok'] );
		$this->assertContains( $post->ID, $captured['processed'] );
	}

	public function test_cleans_up_meta_for_published_post(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		// Set leftover meta from a previous draft/future save.
		update_post_meta( $post->ID, '_wptg_p2tg_options', '{"channels":["@old"]}' );
		update_post_meta( $post->ID, '_wptg_p2tg_send2tg', 'yes' );

		$this->get_sender()->send_post( $post, 'non_wp' );

		// Meta should be cleaned up for a published post.
		$this->assertEmpty( get_post_meta( $post->ID, '_wptg_p2tg_options', true ) );
		$this->assertEmpty( get_post_meta( $post->ID, '_wptg_p2tg_send2tg', true ) );
	}

	// ──────────────────────────────────────────────────
	// C. Security and validity checks (10 tests)
	// ──────────────────────────────────────────────────

	public function test_skips_when_send2tg_is_no(): void {
		// Need post_edit_switch => true so form data is read.
		PostSenderHelper::setup_options( [ 'post_edit_switch' => true ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		// Set form data for send2tg = 'no'.
		$_POST['_wptg_p2tg_send2tg'] = 'no';

		$sv_check_failed = false;
		add_action(
			'wptelegram_p2tg_post_sv_check_failed',
			function () use ( &$sv_check_failed ) {
				$sv_check_failed = true;
			}
		);

		$this->get_sender()->send_post( $post, 'non_wp' );

		$this->assertTrue( $sv_check_failed );
		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_skips_post_revision(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		// Create a revision of the post.
		$revision_id = wp_save_post_revision( $post->ID );
		$revision    = get_post( $revision_id );

		$this->get_sender()->send_post( $revision, 'non_wp' );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_skips_invalid_post_status(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post( [ 'post_status' => 'trash' ] );

		$this->get_sender()->send_post( $post, 'non_wp' );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_skips_when_user_lacks_permission(): void {
		// plugin_posts must be false to reach the capability check.
		PostSenderHelper::setup_options( [ 'plugin_posts' => false ] );
		PostSenderHelper::setup_subscriber_user();
		$post = $this->create_post();

		$this->get_sender()->send_post( $post, 'non_wp' );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );

		// Reset and verify editor CAN send with plugin_posts => false.
		PostSenderHelper::reset_all();
		PostSenderHelper::setup_options( [ 'plugin_posts' => false ] );
		PostSenderHelper::mock_telegram_api();

		PostSenderHelper::setup_editor_user();

		$this->get_sender()->send_post( $post, 'non_wp' );

		$this->assertNotEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_sends_when_plugin_posts_enabled(): void {
		// plugin_posts => true (the effective default) bypasses user capability checks.
		PostSenderHelper::setup_options( [ 'plugin_posts' => true ] );
		PostSenderHelper::setup_subscriber_user();
		$post = $this->create_post();

		$this->get_sender()->send_post( $post, 'non_wp' );

		$this->assertNotEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_current_user_has_permission_filter(): void {
		PostSenderHelper::setup_options( [ 'plugin_posts' => false ] );
		PostSenderHelper::setup_subscriber_user();
		$post = $this->create_post();

		// Override permission via filter.
		add_filter( 'wptelegram_p2tg_current_user_has_permission', '__return_true' );

		$this->get_sender()->send_post( $post, 'non_wp' );

		$this->assertNotEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_skips_when_filter_post_returns_false(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		add_filter( 'wptelegram_p2tg_filter_post', '__return_false' );

		$this->get_sender()->send_post( $post, 'non_wp' );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_skips_during_bulk_edit(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$_GET['bulk_edit'] = '1';

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );

		// Verify the filter can override.
		PostSenderHelper::reset_all();
		PostSenderHelper::setup_options();
		PostSenderHelper::mock_telegram_api();
		PostSenderHelper::setup_editor_user();

		add_filter( 'wptelegram_p2tg_send_if_bulk_edit', '__return_true' );

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertNotEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_skips_gb_metabox_submission(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		// Simulate GB metabox POST.
		$_POST['_wptg_p2tg_is_gb_metabox'] = '1';

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_idempotent_within_same_request(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$sender = $this->get_sender();

		$sender->send_post( $post, 'non_wp' );
		$sender->send_post( $post, 'non_wp' );
		$sender->send_post( $post, 'non_wp' );

		// Only the first call should produce API requests.
		$requests      = PostSenderHelper::get_intercepted_requests();
		$send_requests = array_filter(
			$requests,
			function ( $req ) {
				return in_array(
					PostSenderHelper::get_api_method_from_url( $req['url'] ),
					[ 'sendMessage', 'sendPhoto' ],
					true
				);
			}
		);

		// Should be exactly 1 sendMessage (to 1 channel).
		$this->assertCount( 1, $send_requests );
	}

	// ──────────────────────────────────────────────────
	// D. Rules (9 tests)
	// ──────────────────────────────────────────────────

	public function test_send_when_controls_new_posts(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		// send_when => ['existing'] should block a new post.
		PostSenderHelper::setup_options( [ 'send_when' => [ 'existing' ] ] );

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );

		// send_when => ['new'] should allow a new post.
		PostSenderHelper::reset_all();
		PostSenderHelper::setup_options( [ 'send_when' => [ 'new' ] ] );
		PostSenderHelper::mock_telegram_api();
		PostSenderHelper::setup_editor_user();

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertNotEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_send_when_controls_existing_posts(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		// Mark as already sent (existing post).
		update_post_meta( $post->ID, '_wptg_p2tg_sent2tg', current_time( 'mysql' ) );

		// send_when => ['new'] should block an existing post.
		PostSenderHelper::setup_options( [ 'send_when' => [ 'new' ] ] );

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );

		// send_when => ['existing'] should allow an existing post.
		PostSenderHelper::reset_all();
		PostSenderHelper::setup_options( [ 'send_when' => [ 'existing' ] ] );
		PostSenderHelper::mock_telegram_api();
		PostSenderHelper::setup_editor_user();

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertNotEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_send2tg_yes_bypasses_date_rules(): void {
		PostSenderHelper::setup_options(
			[
				'send_when'        => [ 'existing' ], // Would block a new post.
				'post_edit_switch' => true,
			]
		);
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		// Explicit send2tg => 'yes' bypasses send_when rules.
		$nonce = wp_create_nonce( 'nonce__wptelegram' );

		// phpcs:disable Generic.Formatting.MultipleStatementAlignment
		$_POST['nonce__wptelegram'] = $nonce;
		$_POST['_wptg_p2tg_send2tg'] = 'yes';
		$_POST['_wptg_p2tg_from_web'] = '1';
		// phpcs:enable Generic.Formatting.MultipleStatementAlignment

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertNotEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_post_type_matching(): void {
		PostSenderHelper::setup_editor_user();

		// post_types => ['page'] should block a 'post'.
		PostSenderHelper::setup_options( [ 'post_types' => [ 'page' ] ] );
		$post = $this->create_post();

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );

		// post_types => ['post'] should allow a 'post'.
		PostSenderHelper::reset_all();
		PostSenderHelper::setup_options( [ 'post_types' => [ 'post' ] ] );
		PostSenderHelper::mock_telegram_api();
		PostSenderHelper::setup_editor_user();

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertNotEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_custom_rules_filter_by_category(): void {
		PostSenderHelper::setup_editor_user();
		$cat_id = $this->factory()->category->create( [ 'name' => 'Tech' ] );
		$post   = $this->create_post();
		wp_set_post_categories( $post->ID, [ $cat_id ] );

		// Rule: category 'in' [cat_id] — post is in that category → sends.
		PostSenderHelper::setup_options(
			[
				'rules' => [
					[
						[
							'param'    => 'category',
							'operator' => 'in',
							'values'   => [ [ 'value' => (string) $cat_id ] ],
						],
					],
				],
			]
		);

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertNotEmpty( PostSenderHelper::get_intercepted_requests() );

		// Rule: category 'not_in' [cat_id] — post IS in that category → blocked.
		PostSenderHelper::reset_all();
		PostSenderHelper::setup_options(
			[
				'rules' => [
					[
						[
							'param'    => 'category',
							'operator' => 'not_in',
							'values'   => [ [ 'value' => (string) $cat_id ] ],
						],
					],
				],
			]
		);
		PostSenderHelper::mock_telegram_api();
		PostSenderHelper::setup_editor_user();

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_bypass_post_type_rules_filter(): void {
		PostSenderHelper::setup_options( [ 'post_types' => [ 'page' ] ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post(); // type 'post', doesn't match 'page'.

		add_filter( 'wptelegram_p2tg_bypass_post_type_rules', '__return_true' );

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertNotEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_rules_apply_filter_overrides_result(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		add_filter( 'wptelegram_p2tg_rules_apply', '__return_false' );

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_bypasses_date_rules_for_non_wp_trigger(): void {
		// send_when => ['existing'] would block a new post under normal triggers.
		PostSenderHelper::setup_options( [ 'send_when' => [ 'existing' ] ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		// 'non_wp' trigger adds bypass_post_date_rules filter.
		$this->get_sender()->send_post( $post, 'non_wp' );

		$this->assertNotEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_bypasses_custom_rules_when_force_is_true(): void {
		PostSenderHelper::setup_editor_user();
		$other_cat = $this->factory()->category->create( [ 'name' => 'Other' ] );
		$post      = $this->create_post();

		// Set a custom rule that doesn't match this post.
		PostSenderHelper::setup_options(
			[
				'rules' => [
					[
						[
							'param'    => 'category',
							'operator' => 'in',
							'values'   => [ [ 'value' => (string) $other_cat ] ],
						],
					],
				],
			]
		);

		// force = true should bypass custom rules.
		$this->get_sender()->send_post( $post, 'non_wp', true );

		$this->assertNotEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	// ──────────────────────────────────────────────────
	// E. Options and defaults (6 tests)
	// ──────────────────────────────────────────────────

	public function test_options_come_from_saved_settings(): void {
		PostSenderHelper::setup_options( [ 'channels' => [ '@settings_channel' ] ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$this->assertNotEmpty( $requests );

		$body = PostSenderHelper::get_request_body( $requests[0] );
		$this->assertSame( '@settings_channel', $body['chat_id'] );
	}

	public function test_post_meta_overrides_saved_settings(): void {
		PostSenderHelper::setup_options( [ 'channels' => [ '@settings_channel' ] ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		// Store options override in post meta.
		$meta_options = PostSenderHelper::get_default_p2tg_options(
			[ 'channels' => [ '@meta_channel' ] ]
		);
		update_post_meta(
			$post->ID,
			'_wptg_p2tg_options',
			addslashes( wp_json_encode( $meta_options ) )
		);

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$this->assertNotEmpty( $requests );

		$body = PostSenderHelper::get_request_body( $requests[0] );
		$this->assertSame( '@meta_channel', $body['chat_id'] );
	}

	public function test_get_defaults_returns_expected_keys(): void {
		$defaults = PostSender::get_defaults();

		$expected_keys = [
			'cats_as_tags',
			'channels',
			'delay',
			'disable_notification',
			'link_preview_disabled',
			'link_preview_url',
			'link_preview_above_text',
			'excerpt_length',
			'excerpt_preserve_eol',
			'excerpt_source',
			'image_position',
			'inline_button_text',
			'inline_button_url',
			'inline_url_button',
			'message_template',
			'parse_mode',
			'plugin_posts',
			'post_types',
			'protect_content',
			'rules',
			'send_featured_image',
			'send_when',
			'single_message',
		];

		foreach ( $expected_keys as $key ) {
			$this->assertArrayHasKey( $key, $defaults, "Missing key: {$key}" );
		}
	}

	public function test_get_defaults_filter_allows_modification(): void {
		add_filter(
			'wptelegram_p2tg_defaults',
			function ( $defaults ) {
				$defaults['custom_key'] = 'custom_value';
				return $defaults;
			}
		);

		$defaults = PostSender::get_defaults();

		$this->assertArrayHasKey( 'custom_key', $defaults );
		$this->assertSame( 'custom_value', $defaults['custom_key'] );
	}

	public function test_saved_options_filter_modifies_options(): void {
		PostSenderHelper::setup_options( [ 'channels' => [ '@original' ] ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		// Change channels dynamically via filter.
		add_filter(
			'wptelegram_p2tg_saved_options',
			function ( $options ) {
				$options['channels'] = [ '@filtered_channel' ];
				return $options;
			}
		);

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$body     = PostSenderHelper::get_request_body( $requests[0] );
		$this->assertSame( '@filtered_channel', $body['chat_id'] );
	}

	public function test_options_filter_modifies_final_options(): void {
		PostSenderHelper::setup_options(
			[
				'message_template' => '{post_title}',
				'channels'         => [ '@test_channel' ],
			]
		);
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post( [ 'post_title' => 'Original Title' ] );

		// Override the template via the final options filter.
		add_filter(
			'wptelegram_p2tg_options',
			function ( $options ) {
				$options['message_template'] = 'Filtered message';
				return $options;
			}
		);

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$body     = PostSenderHelper::get_request_body( $requests[0] );
		$this->assertSame( 'Filtered message', $body['text'] );
	}

	// ──────────────────────────────────────────────────
	// F. Delay and scheduling (5 tests)
	// ──────────────────────────────────────────────────

	public function test_no_delay_for_delayed_or_instant_trigger(): void {
		PostSenderHelper::setup_options( [ 'delay' => 5 ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		// 'delayed_post' trigger should send immediately, not re-schedule.
		$this->get_sender()->send_post( $post, 'delayed_post' );

		$this->assertNotEmpty( PostSenderHelper::get_intercepted_requests() );
		$this->assertFalse( wp_next_scheduled( 'wptelegram_p2tg_delayed_post', [ (string) $post->ID ] ) );

		// Same for 'instant' trigger.
		PostSenderHelper::reset_all();
		PostSenderHelper::setup_options( [ 'delay' => 5 ] );
		PostSenderHelper::mock_telegram_api();
		PostSenderHelper::setup_editor_user();

		$this->get_sender()->send_post( $post, 'instant' );

		$this->assertNotEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	public function test_delay_schedules_cron_event(): void {
		PostSenderHelper::setup_options( [ 'delay' => 5 ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$delay_fired = false;
		add_action(
			'wptelegram_p2tg_delay_post',
			function () use ( &$delay_fired ) {
				$delay_fired = true;
			}
		);

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertTrue( $delay_fired );
		// No immediate API call.
		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );
		// Cron event should be scheduled.
		$this->assertNotFalse( wp_next_scheduled( 'wptelegram_p2tg_delayed_post', [ (string) $post->ID ] ) );
	}

	public function test_delay_replaces_previous_event(): void {
		PostSenderHelper::setup_options( [ 'delay' => 5 ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$this->get_sender()->send_post( $post, 'wp_insert_post' );
		$first_time = wp_next_scheduled( 'wptelegram_p2tg_delayed_post', [ (string) $post->ID ] );

		// Reset singletons to allow re-processing.
		PostSenderHelper::reset_all();
		PostSenderHelper::setup_options( [ 'delay' => 10 ] );
		PostSenderHelper::mock_telegram_api();
		PostSenderHelper::setup_editor_user();

		// Sleep briefly so the timestamp differs.
		sleep( 1 );

		$this->get_sender()->send_post( $post, 'wp_insert_post' );
		$second_time = wp_next_scheduled( 'wptelegram_p2tg_delayed_post', [ (string) $post->ID ] );

		$this->assertNotFalse( $second_time );
		$this->assertGreaterThan( $first_time, $second_time );
	}

	public function test_delay_filter_overrides_configured_delay(): void {
		// Configured delay => 0, but filter returns 10.
		PostSenderHelper::setup_options( [ 'delay' => 0 ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		add_filter(
			'wptelegram_p2tg_delay_in_posting',
			function () {
				return 10;
			}
		);

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		// Should schedule cron, no immediate send.
		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );
		$this->assertNotFalse( wp_next_scheduled( 'wptelegram_p2tg_delayed_post', [ (string) $post->ID ] ) );
	}

	public function test_saves_options_to_meta_for_future_post(): void {
		PostSenderHelper::setup_options( [ 'post_edit_switch' => true ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post(
			[
				'post_status' => 'future',
				'post_date'   => gmdate( 'Y-m-d H:i:s', strtotime( '+1 day' ) ),
			]
		);

		$nonce = wp_create_nonce( 'nonce__wptelegram' );

		// phpcs:disable Generic.Formatting.MultipleStatementAlignment
		$_POST['nonce__wptelegram'] = $nonce;
		$_POST['_wptg_p2tg_send2tg'] = 'yes';
		$_POST['_wptg_p2tg_from_web'] = '1';
		$_POST['_wptg_p2tg_override_switch'] = 'on';
		$_POST['_wptg_p2tg_channels'] = [ '@override_channel' ];
		// phpcs:enable Generic.Formatting.MultipleStatementAlignment

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		// No immediate send for future post.
		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );

		// Options should be saved to meta for later use.
		$saved_meta = get_post_meta( $post->ID, '_wptg_p2tg_options', true );
		$this->assertNotEmpty( $saved_meta );

		$saved_options = json_decode( $saved_meta, true );
		$this->assertSame( [ '@override_channel' ], $saved_options['channels'] );

		// send2tg meta should also be saved.
		$this->assertSame( 'yes', get_post_meta( $post->ID, '_wptg_p2tg_send2tg', true ) );
	}

	// ──────────────────────────────────────────────────
	// G. Response building and API params (15 tests)
	// ──────────────────────────────────────────────────

	public function test_sends_message_with_template_text(): void {
		PostSenderHelper::setup_options( [ 'message_template' => '{post_title}' ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post( [ 'post_title' => 'Hello Telegram' ] );

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$this->assertNotEmpty( $requests );

		$method = PostSenderHelper::get_api_method_from_url( $requests[0]['url'] );
		$body   = PostSenderHelper::get_request_body( $requests[0] );

		$this->assertSame( 'sendMessage', $method );
		$this->assertSame( 'Hello Telegram', $body['text'] );
	}

	public function test_excerpt_options_affect_message_text(): void {
		PostSenderHelper::setup_options(
			[
				'message_template'     => '{post_excerpt}',
				'excerpt_source'       => 'post_excerpt',
				'excerpt_length'       => 3,
				'excerpt_preserve_eol' => false,
			]
		);
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post(
			[
				'post_title'   => 'Excerpt Test',
				'post_excerpt' => "First line here\nSecond line overflow extra",
			]
		);

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$body     = PostSenderHelper::get_request_body( $requests[0] );

		// Should be trimmed to 3 words from the excerpt field.
		$this->assertStringContainsString( 'First', $body['text'] );
		$this->assertStringContainsString( 'line', $body['text'] );
		$this->assertStringContainsString( 'here', $body['text'] );
		// Words beyond the 3-word limit should be absent.
		$this->assertStringNotContainsString( 'Second', $body['text'] );
		$this->assertStringNotContainsString( 'overflow', $body['text'] );
		// With preserve_eol false, newlines should be collapsed.
		$this->assertStringNotContainsString( "\n", $body['text'] );
	}

	public function test_excerpt_preserve_eol_keeps_newlines(): void {
		PostSenderHelper::setup_options(
			[
				'message_template'     => '{post_excerpt}',
				'excerpt_source'       => 'post_excerpt',
				'excerpt_length'       => 55,
				'excerpt_preserve_eol' => true,
			]
		);
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post(
			[
				'post_title'   => 'EOL Test',
				'post_excerpt' => "First paragraph\n\nSecond paragraph",
			]
		);

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$body     = PostSenderHelper::get_request_body( $requests[0] );

		// With preserve_eol true, newlines from the original content should be preserved.
		$this->assertStringContainsString( "\n", $body['text'] );
		$this->assertStringContainsString( 'First', $body['text'] );
		$this->assertStringContainsString( 'Second', $body['text'] );
	}

	public function test_cats_as_tags_produces_hashtags(): void {
		PostSenderHelper::setup_options(
			[
				'message_template' => '{terms:category}',
				'cats_as_tags'     => true,
			]
		);
		PostSenderHelper::setup_editor_user();

		$cat_id = $this->factory()->category->create( [ 'name' => 'Tech News' ] );
		$post   = $this->create_post();
		wp_set_post_categories( $post->ID, [ $cat_id ] );

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$body     = PostSenderHelper::get_request_body( $requests[0] );

		$this->assertStringContainsString( '#', $body['text'] );
	}

	public function test_message_template_filter(): void {
		PostSenderHelper::setup_options( [ 'message_template' => '{post_title}' ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post( [ 'post_title' => 'Original' ] );

		add_filter(
			'wptelegram_p2tg_message_template',
			function () {
				return 'Custom template text';
			}
		);

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$body     = PostSenderHelper::get_request_body( $requests[0] );

		$this->assertSame( 'Custom template text', $body['text'] );
	}

	public function test_response_text_filter(): void {
		PostSenderHelper::setup_options( [ 'message_template' => '{post_title}' ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post( [ 'post_title' => 'Original' ] );

		add_filter(
			'wptelegram_p2tg_response_text',
			function () {
				return 'Filtered response text';
			}
		);

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$body     = PostSenderHelper::get_request_body( $requests[0] );

		$this->assertSame( 'Filtered response text', $body['text'] );
	}

	public function test_sends_photo_when_featured_image_exists(): void {
		PostSenderHelper::setup_options( [ 'send_featured_image' => true ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		// Create and attach a thumbnail.
		$attachment_id = $this->factory()->attachment->create_upload_object(
			DIR_TESTDATA . '/images/canola.jpg',
			$post->ID
		);
		set_post_thumbnail( $post->ID, $attachment_id );

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$methods  = array_map(
			function ( $req ) {
				return PostSenderHelper::get_api_method_from_url( $req['url'] );
			},
			$requests
		);

		$this->assertContains( 'sendPhoto', $methods );
	}

	public function test_featured_image_source_filter(): void {
		PostSenderHelper::setup_options( [ 'send_featured_image' => true ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$attachment_id = $this->factory()->attachment->create_upload_object(
			DIR_TESTDATA . '/images/canola.jpg',
			$post->ID
		);
		set_post_thumbnail( $post->ID, $attachment_id );

		add_filter(
			'wptelegram_p2tg_featured_image_source',
			function () {
				return 'https://example.com/custom-image.jpg';
			}
		);

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		foreach ( $requests as $req ) {
			$method = PostSenderHelper::get_api_method_from_url( $req['url'] );
			if ( 'sendPhoto' === $method ) {
				$body = PostSenderHelper::get_request_body( $req );
				$this->assertSame( 'https://example.com/custom-image.jpg', $body['photo'] );
				return;
			}
		}
		$this->fail( 'Expected sendPhoto request not found.' );
	}

	public function test_no_photo_without_thumbnail_or_when_disabled(): void {
		PostSenderHelper::setup_options( [ 'send_featured_image' => false ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$methods  = array_map(
			function ( $req ) {
				return PostSenderHelper::get_api_method_from_url( $req['url'] );
			},
			$requests
		);

		$this->assertNotContains( 'sendPhoto', $methods );
		$this->assertContains( 'sendMessage', $methods );
	}

	public function test_single_message_before_sends_photo_with_caption(): void {
		PostSenderHelper::setup_options(
			[
				'send_featured_image' => true,
				'single_message'      => true,
				'image_position'      => 'before',
				'message_template'    => '{post_title}',
			]
		);
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post( [ 'post_title' => 'Caption Test' ] );

		$attachment_id = $this->factory()->attachment->create_upload_object(
			DIR_TESTDATA . '/images/canola.jpg',
			$post->ID
		);
		set_post_thumbnail( $post->ID, $attachment_id );

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$methods  = array_map(
			function ( $req ) {
				return PostSenderHelper::get_api_method_from_url( $req['url'] );
			},
			$requests
		);

		// Should be only sendPhoto with caption, no separate sendMessage.
		$this->assertContains( 'sendPhoto', $methods );
		$this->assertNotContains( 'sendMessage', $methods );

		// Find the sendPhoto request and check caption.
		foreach ( $requests as $req ) {
			if ( 'sendPhoto' === PostSenderHelper::get_api_method_from_url( $req['url'] ) ) {
				$body = PostSenderHelper::get_request_body( $req );
				$this->assertStringContainsString( 'Caption Test', $body['caption'] );
			}
		}
	}

	public function test_single_message_after_embeds_hidden_image_url(): void {
		PostSenderHelper::setup_options(
			[
				'send_featured_image' => true,
				'single_message'      => true,
				'image_position'      => 'after',
				'parse_mode'          => 'HTML',
				'message_template'    => '{post_title}',
			]
		);
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post( [ 'post_title' => 'Hidden Image Test' ] );

		$attachment_id = $this->factory()->attachment->create_upload_object(
			DIR_TESTDATA . '/images/canola.jpg',
			$post->ID
		);
		set_post_thumbnail( $post->ID, $attachment_id );

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$methods  = array_map(
			function ( $req ) {
				return PostSenderHelper::get_api_method_from_url( $req['url'] );
			},
			$requests
		);

		// Should be sendMessage only (no sendPhoto).
		$this->assertContains( 'sendMessage', $methods );
		$this->assertNotContains( 'sendPhoto', $methods );

		// Text should contain hidden image URL with ZWNJ character.
		foreach ( $requests as $req ) {
			if ( 'sendMessage' === PostSenderHelper::get_api_method_from_url( $req['url'] ) ) {
				$body = PostSenderHelper::get_request_body( $req );
				$this->assertStringContainsString( '<a href=', $body['text'] );
				// ZWNJ may be the literal entity or the decoded Unicode character.
				$has_zwnj = str_contains( $body['text'], '&#8204;' )
					|| str_contains( $body['text'], "\xE2\x80\x8C" );
				$this->assertTrue( $has_zwnj, 'Expected ZWNJ character in hidden image link.' );
			}
		}
	}

	public function test_api_params_passed_through(): void {
		PostSenderHelper::setup_options(
			[
				'disable_notification'  => true,
				'protect_content'       => true,
				'parse_mode'            => 'HTML',
				'link_preview_disabled' => true,
			]
		);
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$body     = PostSenderHelper::get_request_body( $requests[0] );

		$this->assertTrue( $body['disable_notification'] );
		$this->assertTrue( $body['protect_content'] );
		$this->assertSame( 'HTML', $body['parse_mode'] );

		// link_preview_disabled should produce link_preview_options with is_disabled.
		$this->assertArrayHasKey( 'link_preview_options', $body );
		$preview = $body['link_preview_options'];
		if ( is_string( $preview ) ) {
			$preview = json_decode( $preview, true );
		}
		$this->assertTrue( $preview['is_disabled'] );
	}

	public function test_inline_keyboard_added(): void {
		PostSenderHelper::setup_options(
			[
				'inline_url_button'  => true,
				'inline_button_text' => 'Read More',
				'inline_button_url'  => '{full_url}',
			]
		);
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$body     = PostSenderHelper::get_request_body( $requests[0] );

		$this->assertArrayHasKey( 'reply_markup', $body );

		$markup = json_decode( $body['reply_markup'], true );
		$this->assertArrayHasKey( 'inline_keyboard', $markup );
		$this->assertSame( 'Read More', $markup['inline_keyboard'][0][0]['text'] );
	}

	public function test_link_preview_options(): void {
		PostSenderHelper::setup_options(
			[
				'link_preview_disabled'   => false,
				'link_preview_url'        => '{full_url}',
				'link_preview_above_text' => true,
			]
		);
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$body     = PostSenderHelper::get_request_body( $requests[0] );

		$this->assertArrayHasKey( 'link_preview_options', $body );

		$preview = $body['link_preview_options'];
		if ( is_string( $preview ) ) {
			$preview = json_decode( $preview, true );
		}
		$this->assertTrue( $preview['show_above_text'] );
		$this->assertArrayHasKey( 'url', $preview );
	}

	public function test_method_params_filter(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		add_filter(
			'wptelegram_p2tg_method_params',
			function ( $params ) {
				if ( isset( $params['sendMessage'] ) ) {
					$params['sendMessage']['custom_param'] = 'custom_value';
				}
				return $params;
			}
		);

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$body     = PostSenderHelper::get_request_body( $requests[0] );

		$this->assertSame( 'custom_value', $body['custom_param'] );
	}

	public function test_non_live_status_saves_meta_without_sending(): void {
		PostSenderHelper::setup_options( [ 'post_edit_switch' => true ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post( [ 'post_status' => 'draft' ] );

		$nonce = wp_create_nonce( 'nonce__wptelegram' );

		// phpcs:disable Generic.Formatting.MultipleStatementAlignment
		$_POST['nonce__wptelegram'] = $nonce;
		$_POST['_wptg_p2tg_send2tg'] = 'yes';
		$_POST['_wptg_p2tg_from_web'] = '1';
		// phpcs:enable Generic.Formatting.MultipleStatementAlignment

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		// No API call for draft posts.
		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );

		// send2tg meta should be saved for when the post is published later.
		$this->assertSame( 'yes', get_post_meta( $post->ID, '_wptg_p2tg_send2tg', true ) );
	}

	// ──────────────────────────────────────────────────
	// H. Sending and channels (6 tests)
	// ──────────────────────────────────────────────────

	public function test_sends_to_all_channels_with_parsing(): void {
		PostSenderHelper::setup_options(
			[
				'channels'         => [ '@ch1', '@ch2 | Note', '@ch3:42' ],
				'message_template' => '{post_title}',
			]
		);
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post( [ 'post_title' => 'Multi Channel' ] );

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();

		// Collect chat_ids from sendMessage requests.
		$chat_ids   = [];
		$thread_ids = [];
		foreach ( $requests as $req ) {
			if ( 'sendMessage' === PostSenderHelper::get_api_method_from_url( $req['url'] ) ) {
				$body       = PostSenderHelper::get_request_body( $req );
				$chat_ids[] = $body['chat_id'];
				if ( ! empty( $body['message_thread_id'] ) ) {
					$thread_ids[ $body['chat_id'] ] = $body['message_thread_id'];
				}
			}
		}

		$this->assertContains( '@ch1', $chat_ids );
		$this->assertContains( '@ch2', $chat_ids ); // Note stripped.
		$this->assertContains( '@ch3', $chat_ids );
		$this->assertSame( '42', $thread_ids['@ch3'] );
	}

	public function test_updates_post_meta_on_success(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$this->get_sender()->send_post( $post, 'non_wp' );

		$sent2tg = get_post_meta( $post->ID, '_wptg_p2tg_sent2tg', true );
		$this->assertNotEmpty( $sent2tg );
	}

	public function test_handles_wp_error(): void {
		PostSenderHelper::clear_telegram_api_mock();
		PostSenderHelper::mock_telegram_api_error( 'Connection failed' );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$this->get_sender()->send_post( $post, 'non_wp' );

		$errors = get_transient( 'wptelegram_p2tg_errors' );
		$this->assertNotEmpty( $errors );
	}

	public function test_channels_filter_modifies_destinations(): void {
		PostSenderHelper::setup_options( [ 'channels' => [ '@original' ] ] );
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		add_filter(
			'wptelegram_p2tg_send_to_channels',
			function () {
				return [ '@filtered_dest' ];
			}
		);

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();
		$body     = PostSenderHelper::get_request_body( $requests[0] );

		$this->assertSame( '@filtered_dest', $body['chat_id'] );
	}

	public function test_api_method_params_filter_per_channel(): void {
		PostSenderHelper::setup_options(
			[
				'channels'         => [ '@ch1', '@ch2' ],
				'message_template' => '{post_title}',
			]
		);
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post( [ 'post_title' => 'Per Channel' ] );

		add_filter(
			'wptelegram_p2tg_api_method_params',
			function ( $params ) {
				if ( '@ch2' === $params['chat_id'] ) {
					$params['text'] = 'Custom for ch2';
				}
				return $params;
			}
		);

		$this->get_sender()->send_post( $post, 'non_wp' );

		$requests = PostSenderHelper::get_intercepted_requests();

		$texts_by_channel = [];
		foreach ( $requests as $req ) {
			if ( 'sendMessage' === PostSenderHelper::get_api_method_from_url( $req['url'] ) ) {
				$body                                 = PostSenderHelper::get_request_body( $req );
				$texts_by_channel[ $body['chat_id'] ] = $body['text'];
			}
		}

		$this->assertSame( 'Per Channel', $texts_by_channel['@ch1'] );
		$this->assertSame( 'Custom for ch2', $texts_by_channel['@ch2'] );
	}

	public function test_api_response_action_fires(): void {
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$fired = false;
		add_action(
			'wptelegram_p2tg_api_response',
			function () use ( &$fired ) {
				$fired = true;
			}
		);

		$this->get_sender()->send_post( $post, 'non_wp' );

		$this->assertTrue( $fired );
	}

	// ──────────────────────────────────────────────────
	// I. Full happy path (1 test)
	// ──────────────────────────────────────────────────

	public function test_full_happy_path(): void {
		PostSenderHelper::setup_options(
			[
				'channels'         => [ '@happy_channel' ],
				'message_template' => '{post_title}',
				'post_types'       => [ 'post' ],
				'send_when'        => [ 'new' ],
			]
		);
		PostSenderHelper::setup_editor_user();
		$post = $this->create_post( [ 'post_title' => 'Happy Path Post' ] );

		$finish_fired = false;
		add_action(
			'wptelegram_p2tg_post_finish',
			function ( $post_arg, $trigger_arg, $ok ) use ( &$finish_fired ) {
				$finish_fired = $ok;
			},
			10,
			3
		);

		$this->get_sender()->send_post( $post, 'non_wp' );

		// API called with correct params.
		$requests = PostSenderHelper::get_intercepted_requests();
		$this->assertNotEmpty( $requests );

		$body = PostSenderHelper::get_request_body( $requests[0] );
		$this->assertSame( '@happy_channel', $body['chat_id'] );
		$this->assertSame( 'Happy Path Post', $body['text'] );

		// Post meta set.
		$this->assertNotEmpty( get_post_meta( $post->ID, '_wptg_p2tg_sent2tg', true ) );

		// Finish action fired with ok = true.
		$this->assertTrue( $finish_fired );
	}

	// ──────────────────────────────────────────────────
	// J. Constant-dependent tests (MUST BE LAST)
	// These define PHP constants that persist for the
	// entire process.
	// ──────────────────────────────────────────────────

	/**
	 * Skips during autosave.
	 *
	 * @depends test_full_happy_path
	 */
	public function test_skips_during_autosave(): void {
		if ( ! defined( 'DOING_AUTOSAVE' ) ) {
			define( 'DOING_AUTOSAVE', true );
		}

		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );
	}

	/**
	 * Skips during quick edit.
	 *
	 * @depends test_skips_during_autosave
	 */
	public function test_skips_during_quick_edit(): void {
		if ( ! defined( 'DOING_AJAX' ) ) {
			define( 'DOING_AJAX', true );
		}
		$_REQUEST['action'] = 'inline-save';

		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );

		// Clean up for next test.
		unset( $_REQUEST['action'] );
	}

	/**
	 * Skips during import.
	 *
	 * @depends test_skips_during_quick_edit
	 */
	public function test_skips_during_import(): void {
		if ( ! defined( 'WP_IMPORTING' ) ) {
			define( 'WP_IMPORTING', true );
		}

		PostSenderHelper::setup_editor_user();
		$post = $this->create_post();

		$this->get_sender()->send_post( $post, 'wp_insert_post' );

		$this->assertEmpty( PostSenderHelper::get_intercepted_requests() );
	}
}
