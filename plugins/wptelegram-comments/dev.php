<?php
/**
 * Main plugin file.
 *
 * @link              https://wpsocio.com
 * @since             1.0.0
 * @package           @WPTelegram/Comments
 *
 * @wordpress-plugin
 * Plugin Name:       WP Telegram Comments Dev
 * Plugin URI:        https://t.me/WPTelegram
 * Description:       ❌ DO NOT DELETE ❌ Development Environment for WP Telegram Comments. Versioned high to avoid auto update.
 * Version:           999.999.999
 * Requires at least: 6.2
 * Requires PHP:      7.4
 * Author:            WP Socio
 * Author URI:        https://wpsocio.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wptelegram-comments
 * Domain Path:       /languages
 * Update URI:        false
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'WPTELEGRAM_COMMENTS_MAIN_FILE', __FILE__ );

define( 'WPTELEGRAM_COMMENTS_BASENAME', plugin_basename( WPTELEGRAM_COMMENTS_MAIN_FILE ) );

require plugin_dir_path( __FILE__ ) . 'src/wptelegram-comments.php';

register_activation_hook( __FILE__, 'activate_wptelegram_comments' );
register_deactivation_hook( __FILE__, 'deactivate_wptelegram_comments' );
