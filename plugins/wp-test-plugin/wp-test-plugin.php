<?php
/**
 * Plugin mainfile.
 *
 * @link              https://wpsocio.com
 * @since             1.0.0
 * @package           WPTelegram
 *
 * @wordpress-plugin
 * Plugin Name:       WP Test plugin
 * Plugin URI:        https://t.me/WPTelegram
 * Description:       Something here
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
 * Author:            WP Socio
 * Author URI:        https://wpsocio.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wptelegram
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

require_once __DIR__ . '/vendor/autoload.php';

add_action(
	'admin_menu',
	function () {
		add_menu_page(
			__( 'WP Test Main', 'wp-test-plugin' ),
			__( 'WP Test Main', 'wp-test-plugin' ),
			'manage_options',
			'wp-test-plugin',
			function () {
				if ( ! current_user_can( 'manage_options' ) ) {
					return;
				}
				echo '<div id="wp-test-plugin-settings"></div>';
			},
			'dashicons-admin-generic',
			6
		);
	}
);

add_action(
	'admin_menu',
	function () {
		add_menu_page(
			__( 'WP Test Login', 'wp-test-plugin' ),
			__( 'WP Test Login', 'wp-test-plugin' ),
			'manage_options',
			'wp-test-plugin-login',
			function () {
				if ( ! current_user_can( 'manage_options' ) ) {
					return;
				}
				echo '<div id="wp-test-plugin-login"></div>';
			},
			'dashicons-admin-generic',
			6
		);
	}
);

add_action(
	'admin_init',
	function () {
	}
);

add_action(
	'admin_enqueue_scripts',
	function ( $hook_suffix ) {
		$options = new \WPSocio\WPOptions( 'wp_test_plugin_options' );

		if ( 'toplevel_page_wp-test-plugin' === $hook_suffix ) {
			\Kucrut\Vite\enqueue_asset(
				__DIR__ . '/src/assets/build',
				'src/js/main/index.tsx',
				[
					'handle'           => 'wp-test-plugin-main',
					'dependencies'     => [ 'react','react-dom','wp-components','wp-compose' ],
					'css-dependencies' => [ 'wp-components' ],
				]
			);
		}
		if ( 'toplevel_page_wp-test-plugin-login' === $hook_suffix ) {
			\Kucrut\Vite\enqueue_asset(
				__DIR__ . '/src/assets/build',
				'src/js/login/index.tsx',
				[
					'handle'           => 'wp-test-plugin-login',
					'dependencies'     => [ 'react','react-dom','wp-components' ],
					'css-dependencies' => [ 'wp-components' ],
				]
			);

		}
	}
);
