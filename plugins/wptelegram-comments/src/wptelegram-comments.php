<?php
/**
 * The main plugin file.
 *
 * @link              https://wpsocio.com
 * @since             1.0.0
 * @package           WPTelegram\Comments
 *
 * @wordpress-plugin
 * Plugin Name:       WP Telegram Comments
 * Plugin URI:        https://t.me/WPTelegram
 * Description:       Add comments to posts/pages on your WordPress website by using Telegram Comments Widget.
 * Version:           1.1.23
 * Requires at least: 6.4
 * Requires PHP:      7.4
 * Author:            WP Socio
 * Author URI:        https://wpsocio.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wptelegram-comments
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 */
define( 'WPTELEGRAM_COMMENTS_VER', '1.1.23' );

defined( 'WPTELEGRAM_COMMENTS_MAIN_FILE' ) || define( 'WPTELEGRAM_COMMENTS_MAIN_FILE', __FILE__ );

defined( 'WPTELEGRAM_COMMENTS_BASENAME' ) || define( 'WPTELEGRAM_COMMENTS_BASENAME', plugin_basename( WPTELEGRAM_COMMENTS_MAIN_FILE ) );

define( 'WPTELEGRAM_COMMENTS_DIR', untrailingslashit( plugin_dir_path( __FILE__ ) ) );

define( 'WPTELEGRAM_COMMENTS_URL', untrailingslashit( plugins_url( '', __FILE__ ) ) );

/**
 * Include autoloader.
 */
require WPTELEGRAM_COMMENTS_DIR . '/autoload.php';
require_once dirname( WPTELEGRAM_COMMENTS_MAIN_FILE ) . '/vendor/autoload.php';

/**
 * The code that runs during plugin activation.
 */
function activate_wptelegram_comments() {
	\WPTelegram\Comments\includes\Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 */
function deactivate_wptelegram_comments() {
	\WPTelegram\Comments\includes\Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_wptelegram_comments' );
register_deactivation_hook( __FILE__, 'deactivate_wptelegram_comments' );

/**
 * Begins execution of the plugin and acts as the main instance of WPTelegram\Comments.
 *
 * Returns an instance of WPTelegram\Comments\includes\Main to prevent the need to use globals.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 *
 * @return \WPTelegram\Comments\includes\Main
 */
function WPTG_Comments() { // phpcs:ignore WordPress.NamingConventions.ValidFunctionName -- Ignore  snake_case

	return \WPTelegram\Comments\includes\Main::instance();
}

$requirements = new \WPTelegram\Comments\includes\Requirements( WPTELEGRAM_COMMENTS_MAIN_FILE );

if ( $requirements->satisfied() ) {
	// Fire.
	WPTG_Comments()->init();

	define( 'WPTELEGRAM_COMMENTS_LOADED', true );
} else {
	add_filter( 'after_plugin_row_' . WPTELEGRAM_COMMENTS_BASENAME, [ $requirements, 'display_requirements' ] );
}
