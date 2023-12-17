<?php
/**
 * The main plugin file.
 *
 * @link              https://wpsocio.com
 * @since             1.0.0
 * @package           WPTelegram
 *
 * @wordpress-plugin
 * Plugin Name:       WP Telegram Dev
 * Plugin URI:        https://t.me/WPTelegram
 * Description:       ❌ DO NOT DELETE ❌ Development Environment for WP Telegram. Versioned high to avoid auto update.
 * Version:           999.999.999
 * Requires at least: 6.0
 * Requires PHP:      7.0
 * Author:            WP Socio
 * Author URI:        https://t.me/WPTelegram
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wptelegram
 * Domain Path:       /languages
 * Update URI:        false
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

define( 'WPTELEGRAM_MAIN_FILE', __FILE__ );

define( 'WPTELEGRAM_BASENAME', plugin_basename( WPTELEGRAM_MAIN_FILE ) );

require plugin_dir_path( __FILE__ ) . 'src/wptelegram.php';

register_activation_hook( __FILE__, 'activate_wptelegram' );
register_deactivation_hook( __FILE__, 'deactivate_wptelegram' );

/**
 * Fix the bug in kucrut/vite-for-wp
 *
 * @see https://github.com/kucrut/vite-for-wp/issues/76
 */
add_filter(
	'script_loader_tag',
	function ( $tag, $handle, $src ) {

		$entries = implode(
			'|',
			array_keys(
				\WPTelegram\Core\includes\AssetManager::ASSET_ENTRIES
			)
		);

		if ( ! preg_match( "/^wptelegram-($entries)$/", $handle ) ) {
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