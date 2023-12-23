<?php
/**
 * The assets manager of the plugin.
 *
 * @link       https://wpsocio.com
 * @since      3.0.0
 *
 * @package    WPTelegram\Core
 * @subpackage WPTelegram\Core\includes
 */

namespace WPTelegram\Core\includes;

use WPTelegram\Core\includes\restApi\RESTController;
use WPTelegram\Core\includes\restApi\SettingsController;
use DOMDocument;
use DOMXPath;
use WPSocio\WPUtils\JsDependencies;
use WPSocio\WPUtils\ViteAssets;

/**
 * The assets manager of the plugin.
 *
 * Loads the plugin assets.
 *
 * @package    WPTelegram\Core
 * @subpackage WPTelegram\Core\includes
 * @author     WP Socio
 */
class AssetManager extends BaseClass {

	const ADMIN_SETTINGS_ENTRY      = 'js/settings/index.ts';
	const P2TG_BLOCK_EDITOR_ENTRY   = 'js/p2tg-block-editor/index.ts';
	const P2TG_CLASSIC_EDITOR_ENTRY = 'js/p2tg-classic-editor/index.ts';

	const ASSET_ENTRIES = [
		'admin-settings'      => [
			'entry' => self::ADMIN_SETTINGS_ENTRY,
		],
		'p2tg-block-editor'   => [
			'entry' => self::P2TG_BLOCK_EDITOR_ENTRY,
		],
		'p2tg-classic-editor' => [
			'entry' => self::P2TG_CLASSIC_EDITOR_ENTRY,
		],
	];

	const WPTELEGRAM_MENU_HANDLE = 'wptelegram-menu';

	/**
	 * Register the assets.
	 *
	 * @since    3.0.9
	 */
	public function register_assets() {

		$build_dir = $this->plugin()->dir( '/assets/build' );

		$dependencies = new JsDependencies( $build_dir );

		$assets = $this->plugin()->assets();

		foreach ( self::ASSET_ENTRIES as $name => $data ) {
			$entry = $data['entry'];

			$assets->register_asset(
				$entry,
				[
					'handle'       => $this->plugin()->name() . '-' . $name,
					'dependencies' => $dependencies->get( $entry ),
					'in-footer'    => $data['in-footer'] ?? true,
				]
			);
		}

		wp_register_style(
			self::WPTELEGRAM_MENU_HANDLE,
			$this->plugin()->url( sprintf( '/assets/static/css/admin-menu%s.css', wp_scripts_get_suffix() ) ),
			[],
			$this->plugin()->version(),
			'all'
		);
	}

	/**
	 * Add the data to DOM.
	 *
	 * @since 3.0.10
	 *
	 * @param string $handle The script handle to attach the data to.
	 * @param mixed  $data   The data to add.
	 * @param string $var    The JavaScript variable name to use.
	 *
	 * @return void
	 */
	public static function add_dom_data( $handle, $data, $var = 'wptelegram' ) {
		wp_add_inline_script(
			$handle,
			sprintf( 'var %s = %s;', $var, wp_json_encode( $data ) ),
			'before'
		);
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    3.0.0
	 * @param string $hook_suffix The current admin page.
	 */
	public function enqueue_admin_styles( $hook_suffix ) {

		wp_enqueue_style( self::WPTELEGRAM_MENU_HANDLE );

		// Load only on settings page.
		if ( $this->is_settings_page( $hook_suffix ) ) {

			$admin_styles = $this->plugin()->assets()->get_entry_handles( self::ADMIN_SETTINGS_ENTRY, 'styles' );

			foreach ( $admin_styles as $handle ) {
				wp_enqueue_style( $handle );
			}
		}
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    3.0.0
	 * @param string $hook_suffix The current admin page.
	 */
	public function enqueue_admin_scripts( $hook_suffix ) {
		// Load only on settings page.
		if ( $this->is_settings_page( $hook_suffix ) && $this->plugin()->assets()->is_registered( self::ADMIN_SETTINGS_ENTRY ) ) {

			[$handle] = $this->plugin()->assets()->get_entry_handles( self::ADMIN_SETTINGS_ENTRY );

			wp_enqueue_script( $handle );

			// Pass data to JS.
			$data = $this->get_dom_data();

			self::add_dom_data( $handle, $data );
		}
	}

	/**
	 * Get the common DOM data.
	 *
	 * @param string $for The domain for which the DOM data is to be rendered.
	 * possible values: 'SETTINGS_PAGE' | 'BLOCKS'.
	 *
	 * @return array
	 */
	public function get_dom_data( $for = 'SETTINGS_PAGE' ) {
		$data = [
			'pluginInfo' => [
				'title'       => $this->plugin()->title(),
				'name'        => $this->plugin()->name(),
				'version'     => $this->plugin()->version(),
				'description' => __( 'With this plugin, you can send posts to Telegram and receive notifications and do lot more :)', 'wptelegram' ),
			],
			'api'        => [
				'admin_url'      => admin_url(),
				'nonce'          => wp_create_nonce( 'wptelegram' ),
				'use'            => 'SERVER', // or may be 'BROWSER'?
				'rest_namespace' => RESTController::REST_NAMESPACE,
				'wp_rest_url'    => esc_url_raw( rest_url() ),
			],
			'uiData'     => [
				'debug_info' => $this->get_debug_info(),
			],
			'i18n'       => Utils::get_jed_locale_data( 'wptelegram' ),
		];

		if ( 'SETTINGS_PAGE' === $for ) {
			$data['assets'] = [
				'logoUrl'        => $this->plugin()->url( '/assets/static/icons/icon-128x128.png' ),
				'tgIconUrl'      => $this->plugin()->url( '/assets/static/icons/tg-icon.svg' ),
				'editProfileUrl' => get_edit_profile_url( get_current_user_id() ),
				'p2tgLogUrl'     => Logger::get_log_url( 'p2tg' ),
				'botApiLogUrl'   => Logger::get_log_url( 'bot-api' ),
			];
		}

		// Not to expose bot token to non-admins.
		if ( 'SETTINGS_PAGE' === $for && current_user_can( 'manage_options' ) ) {
			$data['savedSettings'] = SettingsController::get_default_settings();
		}

		return apply_filters( 'wptelegram_assets_dom_data', $data, $for, $this->plugin() );
	}

	/**
	 * Get debug info.
	 */
	public function get_debug_info() {

		$info  = 'PHP:         ' . PHP_VERSION . PHP_EOL;
		$info .= 'WP:          ' . get_bloginfo( 'version' ) . PHP_EOL;
		$info .= 'Plugin:      ' . $this->plugin()->name() . ':v' . $this->plugin()->version() . PHP_EOL;
		$info .= 'DOMDocument: ' . ( class_exists( DOMDocument::class ) ? '✓' : '✕' ) . PHP_EOL;
		$info .= 'DOMXPath:    ' . ( class_exists( DOMXPath::class ) ? '✓' : '✕' ) . PHP_EOL;

		return $info;
	}

	/**
	 * Whether the current page is the plugin settings page.
	 *
	 * @since 3.0.0
	 *
	 * @param string $hook_suffix The current admin page.
	 */
	public function is_settings_page( $hook_suffix ) {
		return 'toplevel_page_' . $this->plugin()->name() === $hook_suffix;
	}
}
