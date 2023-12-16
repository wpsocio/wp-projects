<?php
/**
 * Fired during plugin activation
 *
 * @link       https://wpsocio.com
 * @since      1.0.0
 *
 * @package    WPTelegram_Widget
 * @subpackage WPTelegram_Widget/includes
 */

namespace WPTelegram\Widget\includes;

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    WPTelegram_Widget
 * @subpackage WPTelegram_Widget/includes
 * @author     WP Socio
 */
class Activator {

	/**
	 * Do the activation stuff
	 *
	 * @since    1.0.0
	 */
	public static function activate() {
		if ( ! wp_next_scheduled( 'wptelegram_widget_cron_pull_updates' ) ) {
			wp_schedule_event( time(), 'wptelegram_five_minutely', 'wptelegram_widget_cron_pull_updates' );
		}

		/**
		 * Calling flush_rewrite_rules() does not work in certain cases.
		 *
		 * @see http://core.trac.wordpress.org/ticket/14761#comment:12
		 */
		delete_option( 'rewrite_rules' );
	}
}
