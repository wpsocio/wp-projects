<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @link       https://wpsocio.com
 * @since      1.0.0
 *
 * @package    WPTelegram_Widget
 */

// If uninstall not called from WordPress, then exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) || ! WP_UNINSTALL_PLUGIN || dirname( WP_UNINSTALL_PLUGIN ) !== dirname( plugin_basename( __FILE__ ) ) ) {

	status_header( 404 );
	exit;
}
delete_option( 'wptelegram_widget' );
delete_option( 'wptelegram_widget_ver' );
