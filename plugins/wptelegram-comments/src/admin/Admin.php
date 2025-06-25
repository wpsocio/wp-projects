<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://wpsocio.com
 * @since      1.0.0
 *
 * @package    WPTelegram\Comments
 * @subpackage WPTelegram\Comments\admin
 */

namespace WPTelegram\Comments\admin;

use WPTelegram\Comments\includes\BaseClass;

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    WPTelegram\Comments
 * @subpackage WPTelegram\Comments\admin
 * @author     WP Socio
 */
class Admin extends BaseClass {

	/**
	 * Register WP REST API routes.
	 *
	 * @since 1.0.0
	 */
	public function register_rest_routes() {
		$controller = new \WPTelegram\Comments\includes\restApi\SettingsController();
		$controller->register_routes();
	}

	/**
	 * Register the admin menu.
	 *
	 * @since 1.0.0
	 */
	public function add_plugin_admin_menu() {
		add_submenu_page(
			'wptelegram',
			esc_html( $this->plugin()->title() ),
			esc_html__( 'Telegram Comments', 'wptelegram-comments' ),
			'manage_options',
			$this->plugin()->name(),
			[ $this, 'display_plugin_admin_page' ]
		);
	}

	/**
	 * Render the settings page for this plugin.
	 *
	 * @since 1.0.0
	 */
	public function display_plugin_admin_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$this->plugin()->iframed_wp_admin()->render_root();
	}
}
