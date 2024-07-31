<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://wpsocio.com
 * @since      1.0.0
 *
 * @package    WPTelegram\Widget
 * @subpackage WPTelegram\Widget\admin
 */

namespace WPTelegram\Widget\admin;

use WPTelegram\Widget\includes\BaseClass;
use WPTelegram\BotAPI\API as BotAPI;

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two hooks to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    WPTelegram\Widget
 * @subpackage WPTelegram\Widget\admin
 * @author     WP Socio
 */
class Admin extends BaseClass {

	/**
	 * Enqueue assets for the Gutenberg block
	 *
	 * @since 1.7.0
	 * @param string $hook_suffix The current admin page.
	 */
	public function is_settings_page( $hook_suffix ) {
		return ( current_user_can( 'manage_options' ) && false !== strpos( $hook_suffix, '_page_' . $this->plugin()->name() ) );
	}

	/**
	 * Registers custom category for blocks.
	 *
	 * @since 1.9.0
	 *
	 * @param array $categories The block categories.
	 * @return array
	 */
	public function register_block_category( $categories ) {
		$slugs = wp_list_pluck( $categories, 'slug' );
		$slug  = 'wptelegram';
		if ( in_array( $slug, $slugs, true ) ) {
			return $categories;
		}

		$categories[] = [
			'slug'  => $slug,
			'title' => __( 'WP Telegram', 'wptelegram-widget' ),
			'icon'  => null,
		];

		return $categories;
	}

	/**
	 * Register WP REST API routes.
	 *
	 * @since 1.7.0
	 */
	public function register_rest_routes() {
		$controller = new \WPTelegram\Widget\includes\restApi\SettingsController();
		$controller->register_routes();
	}

	/**
	 * Register the admin menu.
	 *
	 * @since 1.7.0
	 */
	public function add_plugin_admin_menu() {
		add_submenu_page(
			'wptelegram',
			esc_html( $this->plugin()->title() ),
			esc_html__( 'Telegram Widget', 'wptelegram-widget' ),
			'manage_options',
			$this->plugin()->name(),
			[ $this, 'display_plugin_admin_page' ]
		);
	}

	/**
	 * Render the settings page for this plugin.
	 *
	 * @since 1.7.0
	 */
	public function display_plugin_admin_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		if ( $this->plugin()->doing_upgrade() ) {
			return printf(
				'<h1>%1$s %2$s</h1>',
				esc_html__( 'Plugin data has been upgraded.', 'wptelegram-widget' ),
				esc_html__( 'Please reload the page.', 'wptelegram-widget' )
			);
		}
		?>
			<div id="wptelegram-widget-settings"></div>
		<?php
	}

	/**
	 * Create our feed widget
	 *
	 * @since    1.0.0
	 */
	public function register_widgets() {

		register_widget( '\WPTelegram\Widget\shared\widgets\Legacy' );

		register_widget( '\WPTelegram\Widget\shared\widgets\Ajax' );

		register_widget( '\WPTelegram\Widget\shared\widgets\JoinChannel' );
	}

	/**
	 * Fire the pull updates action.
	 *
	 * @since    1.5.0
	 */
	public function fire_pull_updates() {
		do_action( 'wptelegram_widget_pull_the_updates' );
	}

	/**
	 * Pull the updates from Telegram.
	 *
	 * @since 1.5.0
	 */
	public function pull_the_updates() {

		/**
		 * Fires before doing anything
		 */
		do_action( 'wptelegram_widget_pull_updates_init' );

		$bot_token = $this->plugin()->options()->get_path( 'legacy_widget.bot_token' );
		$username  = $this->plugin()->options()->get_path( 'legacy_widget.username' );

		if ( ! $bot_token || ! $username ) {
			return;
		}

		$params = $this->get_update_params();

		$bot_api = new BotAPI( $bot_token );

		$res = $bot_api->getUpdates( $params );

		if ( ! $bot_api->is_success( $res ) ) {

			do_action( 'wptelegram_widget_getupdates_failed', $res, $bot_token );

			$delete_webhook = (bool) apply_filters( 'wptelegram_widget_delete_webhook', true, $bot_token );
			// Conflict: when webhook is active.
			if ( $delete_webhook && ! is_wp_error( $res ) && 409 === $res->get_response_code() ) {
				$bot_api->deleteWebhook();
			}
			return;
		}

		$updates = $res->get_result();

		// for tests.
		$updates = (array) apply_filters( 'wptelegram_widget_updates', $updates );

		do_action( 'wptelegram_widget_after_getupdates', $updates, $res );

		if ( ! empty( $updates ) ) {
			// Pass the updates to the handler.
			$this->handle_updates( $updates );
		}

		/**
		 * Fires after doing everything
		 */
		do_action( 'wptelegram_widget_pull_updates_finish', $updates );

		exit( 'Done :)' );
	}

	/**
	 * Get params for getUpdates
	 *
	 * @since    1.0.0
	 */
	private function get_update_params() {

		$update_id = (int) $this->plugin()->options()->get( 'last_update_id' );

		$offset = null;

		if ( $update_id ) {
			$offset = ++$update_id;
		}

		$allowed_updates = json_encode( $this->get_allowed_updates() ); // phpcs:ignore WordPress.WP.AlternativeFunctions

		$update_params = compact( 'offset', 'allowed_updates' );

		return (array) apply_filters( 'wptelegram_widget_update_params', $update_params );
	}

	/**
	 * Get allowed_updates
	 *
	 * @since    1.0.0
	 */
	private function get_allowed_updates() {

		$allowed_updates = [
			'channel_post',
			// 'edited_channel_post',
			'message',
			// 'edited_message',
		];

		return (array) apply_filters( 'wptelegram_widget_allowed_updates', $allowed_updates );
	}

	/**
	 * Handle updates
	 *
	 * @param array $updates Array of updates.
	 *
	 * @since    1.0.0
	 */
	private function handle_updates( $updates ) {

		/**
		 * Fires before doing anything
		 */
		do_action( 'wptelegram_widget_handle_updates_init', $updates );

		$new_messages = [];

		foreach ( (array) $updates as $update ) {

			$message_id = $this->process_update( $update );

			if ( $message_id ) {
				$new_messages[] = $message_id;
			}
		}

		$update_id = $update['update_id'];

		$this->plugin()->options()->set( 'last_update_id', $update_id );

		if ( ! empty( $new_messages ) ) {
			$username = $this->plugin()->options()->get_path( 'legacy_widget.username', '' );

			$this->save_messages( $new_messages, $username );
		}

		/**
		 * Fires after doing everything
		 */
		do_action( 'wptelegram_widget_handle_updates_finish', $updates, $new_messages );
	}

	/**
	 * Process an update.
	 *
	 * @param array $update    Update object.
	 *
	 * @since    1.3.0
	 */
	private function process_update( $update ) {

		/**
		 * Fires before doing anything
		 */
		do_action( 'wptelegram_widget_process_update_init', $update );

		$update_type = $this->get_update_type( $update );

		if ( ! $update_type ) {
			return false;
		}

		$message = $update[ $update_type ];

		$verified = $this->verify_username( $message );

		if ( ! $verified ) {
			return false;
		}

		/**
		 * Fires after doing everything
		 */
		do_action( 'wptelegram_widget_process_update_finish', $update, $message, $verified );

		return $message['message_id'];
	}

	/**
	 * Get the update_type.
	 *
	 * @since 1.0.0
	 * @param array $update The update object.
	 */
	private function get_update_type( $update ) {

		$update_type = '';

		$allowed_types = $this->get_allowed_updates();

		foreach ( $allowed_types as $type ) {

			if ( isset( $update[ $type ] ) ) {

				$update_type = $type;
				break;
			}
		}

		return apply_filters( 'wptelegram_widget_update_type', $update_type, $update );
	}

	/**
	 * Verify that the update if from the saved channel.
	 * Verify by comparing username.
	 *
	 * @since 1.0.0
	 * @param array $message The message object.
	 */
	private function verify_username( $message ) {

		$verified = false;

		$username = false;

		if ( ! empty( $message['chat']['username'] ) ) {

			$username = $message['chat']['username'];
		}

		$saved_username = $this->plugin()->options()->get_path( 'legacy_widget.username' );

		if ( ! empty( $saved_username ) && strtolower( $saved_username ) === strtolower( $username ) ) {
			$verified = true;
		}

		return (bool) apply_filters( 'wptelegram_widget_verify_username', $verified, $message );
	}

	/**
	 * Store the message_ids.
	 *
	 * @since  1.0.0
	 *
	 * @param array  $new_messages The message IDs.
	 * @param string $username     The username to save the messages for.
	 * @return void
	 */
	public function save_messages( array $new_messages, $username ) {

		$username = strtolower( $username );

		$saved_messages = $this->plugin()->options()->get( 'messages', [] );

		$saved_username_messages = ! empty( $saved_messages[ $username ] ) ? $saved_messages[ $username ] : [];

		$messages = array_filter( array_unique( array_merge( $saved_username_messages, $new_messages ) ) );

		// Allow maximum 50 messages.
		$limit = (int) apply_filters( 'wptelegram_widget_saved_messages_limit', 50 );

		$count = count( $messages );

		while ( $count > $limit ) {
			array_shift( $messages );

			$count = count( $messages );
		}

		$saved_messages[ $username ] = $messages;

		$this->plugin()->options()->set( 'messages', $saved_messages );
	}

	/**
	 * Save the messages sent by WP Telegram P2TG.
	 *
	 * @since  1.5.0
	 *
	 * @param \Object  $res       The response from API call.
	 * @param array    $responses The responses sent via P2TG.
	 * @param \WP_Post $post      The post being sent.
	 * @param \Object  $options   P2TG options object.
	 * @param \Object  $bot_api   Bot API object.
	 */
	public function save_messages_sent_by_p2tg( $res, $responses, $post, $options, $bot_api ) {

		// if the message was not sent successfully.
		if ( ! $bot_api->is_success( $res ) ) {
			return;
		}

		// if the same bot token was not used.
		if ( $bot_api->get_bot_token() !== $this->plugin()->options()->get_path( 'legacy_widget.bot_token' ) ) {
			return;
		}

		$result = $res->get_result();

		if ( empty( $result['chat']['username'] ) ) {
			return;
		}

		$used_username  = strtolower( $result['chat']['username'] );
		$saved_username = strtolower( $this->plugin()->options()->get_path( 'legacy_widget.username' ) );

		if ( $used_username !== $saved_username ) {
			return;
		}

		$messages = [ $result['message_id'] ];

		$this->save_messages( $messages, $saved_username );
	}
}
