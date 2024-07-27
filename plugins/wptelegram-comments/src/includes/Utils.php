<?php
/**
 * Utility methods.
 *
 * @link       https://wpsocio.com
 * @since      1.1.0
 *
 * @package    WPTelegram\Comments
 * @subpackage WPTelegram\Comments\includes
 */

namespace WPTelegram\Comments\includes;

/**
 * Utility methods.
 *
 * Utility methods.
 *
 * @package    WPTelegram\Comments
 * @subpackage WPTelegram\Comments\includes
 * @author     WP Socio
 */
class Utils extends \WPSocio\WPUtils\Helpers {

	/**
	 * Check whether the template path is valid.
	 *
	 * @since 1.1.0
	 * @param string $template The template path.
	 *
	 * @return bool
	 */
	public static function is_valid_template( $template ) {
		/**
		 * Only allow templates that are in the active theme directory,
		 * parent theme directory, or the /wp-includes/theme-compat/ directory
		 * (prevent directory traversal attacks)
		 */
		$valid_paths = array_map(
			'realpath',
			[
				get_stylesheet_directory(),
				get_template_directory(),
				ABSPATH . WPINC . '/theme-compat/',
			]
		);

		$path = realpath( $template );

		foreach ( $valid_paths as $valid_path ) {
			if ( preg_match( '#\A' . preg_quote( $valid_path, '#' ) . '#', $path ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Update the menu structure to make WP Telegram the top level link.
	 */
	public static function update_menu_structure() {
		global $admin_page_hooks;

		if ( ! defined( 'WPTELEGRAM_LOADED' ) && empty( $admin_page_hooks['wptelegram'] ) ) {
			add_menu_page(
				'WP Telegram',
				'WP Telegram',
				'manage_options',
				'wptelegram',
				null,
				'',
				80
			);
			add_action( 'admin_menu', [ __CLASS__, 'remove_wptelegram_menu' ], 20 );
		}
	}

	/**
	 * Update the menu structure to remove WP Telegram top level link.
	 */
	public static function remove_wptelegram_menu() {
		global $submenu;

		if ( ! current_user_can( 'manage_options' ) || empty( $submenu['wptelegram'] ) ) {
			return;
		}

		$key = null;
		foreach ( $submenu['wptelegram'] as $submenu_key => $submenu_item ) {
			if ( 'wptelegram' === $submenu_item[2] ) {
				$key = $submenu_key;
				break;
			}
		}

		if ( null === $key ) {
			return;
		}

		unset( $submenu['wptelegram'][ $key ] );
	}
}
