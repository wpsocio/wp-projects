<?php
/**
 * Fired during plugin deactivation
 *
 * @link       https://wpsocio.com
 * @since      1.0.0
 *
 * @package    WPTelegram_Widget
 * @subpackage WPTelegram_Widget/includes
 */

namespace WPTelegram\Widget\includes;

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 * @package    WPTelegram_Widget
 * @subpackage WPTelegram_Widget/includes
 * @author     WP Socio
 */
class Deactivator {

	/**
	 * Clean up the things
	 *
	 * Delete cron jobs etc.
	 *
	 * @since    1.0.0
	 */
	public static function deactivate() {

		wp_clear_scheduled_hook( 'wptelegram_widget_cron_pull_updates' );

		/**
		 * Calling flush_rewrite_rules() does not work in certain cases.
		 *
		 * @see http://core.trac.wordpress.org/ticket/14761#comment:12
		 */
		delete_option( 'rewrite_rules' );
	}
}
