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
 * Requires at least: 6.1
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

/**
 * Fix the bug in kucrut/vite-for-wp
 *
 * @see https://github.com/kucrut/vite-for-wp/issues/76
 */
add_filter(
	'script_loader_tag',
	function ( $tag, $handle, $src ) {
		if ( 'wptelegram_comments-admin-settings' !== $handle ) {
			return $tag;
		}

		$processor = new WP_HTML_Tag_Processor( $tag );

		$script_fount = false;

		do {
			$script_fount = $processor->next_tag( 'script' );

			// Remove the type attribute from the inline script tag.
			if ( $script_fount && $processor->get_attribute( 'src' ) !== $src ) {
				$processor->remove_attribute( 'type' );
			}
		} while ( $processor->get_attribute( 'src' ) !== $src );

		if ( $script_fount ) {
			$processor->set_attribute( 'type', 'module' );
		}

		return $processor->get_updated_html();
	},
	20,
	3
);
