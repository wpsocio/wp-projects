<?php
/**
 * Tests for the Upgrade class.
 *
 * @package WPTelegram\Core\includes
 *
 * @phpcs:disable Squiz.Commenting.FunctionComment, Squiz.Commenting.ClassComment
 */

use WPTelegram\Core\includes\Upgrade;
use WPTelegram\Tests\Helpers\UpgradeHelper;

/**
 * Note on test ordering:
 *
 * WPTELEGRAM_DOING_UPGRADE is a PHP constant that cannot be undefined once set.
 * The bootstrap pre-sets wptelegram_ver to '999.0.0' so do_upgrade() returns
 * early during WordPress init (constant never defined).
 *
 * Tests that verify "no upgrade" behavior come first (ordered via @depends).
 * Tests that trigger an actual upgrade (defining the constant) come after.
 */
class UpgradeTest extends WP_UnitTestCase {

	public function setUp(): void {
		parent::setUp();
		UpgradeHelper::reset_all();
	}

	// ──────────────────────────────────────────────────
	// Early return — no upgrade needed
	// ──────────────────────────────────────────────────

	public function test_returns_early_when_stored_version_equals_plugin_version(): void {
		update_option( 'wptelegram_ver', WPTELEGRAM_VER );

		$ran = false;
		add_action(
			'wptelegram_before_do_upgrade',
			function () use ( &$ran ) {
				$ran = true;
			}
		);

		Upgrade::instance()->do_upgrade();

		$this->assertFalse( $ran );
	}

	public function test_returns_early_when_stored_version_is_greater(): void {
		update_option( 'wptelegram_ver', '999.0.0' );

		$ran = false;
		add_action(
			'wptelegram_before_do_upgrade',
			function () use ( &$ran ) {
				$ran = true;
			}
		);

		Upgrade::instance()->do_upgrade();

		$this->assertFalse( $ran );
	}

	public function test_does_not_define_constant_when_no_upgrade_needed(): void {
		update_option( 'wptelegram_ver', WPTELEGRAM_VER );

		Upgrade::instance()->do_upgrade();

		$this->assertFalse( defined( 'WPTELEGRAM_DOING_UPGRADE' ) );
	}

	// ──────────────────────────────────────────────────
	// Actions and hooks
	// ──────────────────────────────────────────────────

	public function test_fires_before_and_after_upgrade_actions(): void {
		update_option( 'wptelegram_ver', '4.0.0' );

		$hooks = [];
		add_action(
			'wptelegram_before_do_upgrade',
			function () use ( &$hooks ) {
				$hooks[] = 'before';
			}
		);
		add_action(
			'wptelegram_after_do_upgrade',
			function () use ( &$hooks ) {
				$hooks[] = 'after';
			}
		);

		Upgrade::instance()->do_upgrade();

		$this->assertSame( [ 'before', 'after' ], $hooks );
	}

	public function test_passes_stored_version_to_before_upgrade_action(): void {
		update_option( 'wptelegram_ver', '3.0.5' );

		$received_version = null;
		add_action(
			'wptelegram_before_do_upgrade',
			function ( $version ) use ( &$received_version ) {
				$received_version = $version;
			}
		);

		Upgrade::instance()->do_upgrade();

		$this->assertSame( '3.0.5', $received_version );
	}

	// ──────────────────────────────────────────────────
	// Version updates
	// ──────────────────────────────────────────────────

	public function test_updates_version_to_current_plugin_version(): void {
		update_option( 'wptelegram_ver', '4.0.0' );

		Upgrade::instance()->do_upgrade();

		$this->assertSame( WPTELEGRAM_VER, get_option( 'wptelegram_ver' ) );
	}

	public function test_defaults_stored_version_to_1_9_4_when_option_missing(): void {
		delete_option( 'wptelegram_ver' );

		$received_version = null;
		add_action(
			'wptelegram_before_do_upgrade',
			function ( $version ) use ( &$received_version ) {
				$received_version = $version;
			}
		);

		Upgrade::instance()->do_upgrade();

		$this->assertSame( '1.9.4', $received_version );
		$this->assertSame( WPTELEGRAM_VER, get_option( 'wptelegram_ver' ) );
	}

	// ──────────────────────────────────────────────────
	// Fresh install vs existing install
	// ──────────────────────────────────────────────────

	public function test_skips_version_specific_methods_for_fresh_installs(): void {
		delete_option( 'wptelegram_ver' );
		// Fresh install: no wptelegram_telegram and no wptelegram options.
		delete_option( 'wptelegram_telegram' );
		delete_option( 'wptelegram' );

		Upgrade::instance()->do_upgrade();

		// Version should be updated.
		$this->assertSame( WPTELEGRAM_VER, get_option( 'wptelegram_ver' ) );

		// upgrade_to_2_0_0 creates the 'wptelegram' option for existing installs.
		// For fresh installs, it should NOT have been created by the upgrade method.
		$this->assertFalse( get_option( 'wptelegram' ) );
	}

	public function test_runs_version_specific_methods_for_existing_installs(): void {
		update_option( 'wptelegram_ver', '1.9.4' );
		// Existing install: the old 'wptelegram_telegram' option exists.
		update_option( 'wptelegram_telegram', [ 'bot_token' => '123:ABC' ] );

		Upgrade::instance()->do_upgrade();

		$this->assertSame( WPTELEGRAM_VER, get_option( 'wptelegram_ver' ) );

		// upgrade_to_2_0_0 deletes old option keys.
		$this->assertFalse( get_option( 'wptelegram_telegram' ) );
	}

	// ──────────────────────────────────────────────────
	// Try/catch resilience
	// ──────────────────────────────────────────────────

	public function test_updates_version_even_when_upgrade_method_throws(): void {
		// Set version to just before 4.1.0 so upgrade_to_4_1_0 runs.
		update_option( 'wptelegram_ver', '4.0.19' );
		// Mark as existing install.
		update_option( 'wptelegram', wp_json_encode( [ 'bot_token' => '123:ABC' ] ) );

		// Make the upgrade method throw by intercepting the option update it performs.
		add_filter(
			'pre_update_option_wptelegram',
			function () {
				throw new \RuntimeException( 'Simulated upgrade error' );
			}
		);

		Upgrade::instance()->do_upgrade();

		// Version should still be updated to current despite the error.
		$this->assertSame( WPTELEGRAM_VER, get_option( 'wptelegram_ver' ) );
	}

	public function test_fires_upgrade_error_action_when_method_throws(): void {
		update_option( 'wptelegram_ver', '4.0.19' );
		update_option( 'wptelegram', wp_json_encode( [ 'bot_token' => '123:ABC' ] ) );

		$errors = [];
		add_action(
			'wptelegram_upgrade_error',
			function ( $error, $version ) use ( &$errors ) {
				$errors[] = [
					'error'   => $error,
					'version' => $version,
				];
			},
			10,
			2
		);

		$should_throw = true;
		add_filter(
			'pre_update_option_wptelegram',
			function ( $value ) use ( &$should_throw ) {
				if ( $should_throw ) {
					$should_throw = false;
					throw new \RuntimeException( 'Simulated upgrade error' );
				}
				return $value;
			}
		);

		Upgrade::instance()->do_upgrade();

		$this->assertNotEmpty( $errors );
		$this->assertInstanceOf( \RuntimeException::class, $errors[0]['error'] );
		$this->assertSame( 'Simulated upgrade error', $errors[0]['error']->getMessage() );
		$this->assertSame( '4.1.0', $errors[0]['version'] );
	}

	// ──────────────────────────────────────────────────
	// Specific upgrade methods
	// ──────────────────────────────────────────────────

	public function test_migrates_telegram_chat_id_user_meta_in_upgrade_to_2_2_0(): void {
		update_option( 'wptelegram_ver', '2.1.9' );
		// Mark as existing install.
		update_option( 'wptelegram', '{}' );

		// Create test users with old meta key.
		$user1 = wp_insert_user(
			[
				'user_login' => 'testuser1',
				'user_pass'  => 'password',
				'user_email' => 'test1@example.com',
			]
		);
		$user2 = wp_insert_user(
			[
				'user_login' => 'testuser2',
				'user_pass'  => 'password',
				'user_email' => 'test2@example.com',
			]
		);

		update_user_meta( $user1, 'telegram_chat_id', '12345' );
		update_user_meta( $user2, 'telegram_chat_id', '67890' );

		Upgrade::instance()->do_upgrade();

		// Old meta should be deleted.
		$this->assertEmpty( get_user_meta( $user1, 'telegram_chat_id', true ) );
		$this->assertEmpty( get_user_meta( $user2, 'telegram_chat_id', true ) );

		// New meta should be set.
		$this->assertSame( '12345', get_user_meta( $user1, WPTELEGRAM_USER_ID_META_KEY, true ) );
		$this->assertSame( '67890', get_user_meta( $user2, WPTELEGRAM_USER_ID_META_KEY, true ) );
	}

	// ──────────────────────────────────────────────────
	// Constant and doing_upgrade()
	// ──────────────────────────────────────────────────

	public function test_defines_constant_when_upgrade_runs(): void {
		update_option( 'wptelegram_ver', '4.0.0' );

		Upgrade::instance()->do_upgrade();

		$this->assertTrue( defined( 'WPTELEGRAM_DOING_UPGRADE' ) );
		$this->assertTrue( WPTELEGRAM_DOING_UPGRADE );
	}

	public function test_doing_upgrade_returns_true_after_upgrade(): void {
		// The constant was defined by a previous test and persists.
		$this->assertTrue( WPTG()->doing_upgrade() );
	}
}
