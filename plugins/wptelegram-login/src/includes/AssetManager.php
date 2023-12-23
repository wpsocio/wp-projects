<?php
/**
 * The assets manager of the plugin.
 *
 * @link       https://wpsocio.com
 * @since      1.0.0
 *
 * @package    WPTelegram\Login
 * @subpackage WPTelegram\Login\includes
 */

namespace WPTelegram\Login\includes;

use WPTelegram\Login\includes\restApi\SettingsController;
use Kucrut\Vite;
use WPSocio\WPUtils\JsDependencies;

/**
 * The assets manager of the plugin.
 *
 * Loads the plugin assets.
 *
 * @package    WPTelegram\Login
 * @subpackage WPTelegram\Login\includes
 * @author     WP Socio
 */
class AssetManager extends BaseClass {

	const ADMIN_SETTINGS_ENTRY = 'js/settings/index.ts';
	const BLOCKS_ENTRY         = 'js/blocks/index.ts';
	const WP_LOGIN_ENTRY       = 'js/wp-login/index.ts';
	const WEB_APP_LOGIN_ENTRY  = 'js/web-app-login/index.ts';

	const ASSET_ENTRIES = [
		'admin-settings' => [
			'entry' => self::ADMIN_SETTINGS_ENTRY,
		],
		'blocks'         => [
			'entry'    => self::BLOCKS_ENTRY,
			'css-deps' => [
				'wp-components',
			],
		],
		'wp-login'       => [
			'entry' => self::WP_LOGIN_ENTRY,
		],
		'web-app-login'  => [
			'entry'         => self::WEB_APP_LOGIN_ENTRY,
			'external-deps' => [
				self::WEB_APP_EXTERNAL_SCRIPT_HANDLE => 'https://telegram.org/js/telegram-web-app.js',
			],
		],
	];

	const WEB_APP_EXTERNAL_SCRIPT_HANDLE = 'wptelegram-login-web-app-script';

	const WPTELEGRAM_MENU_HANDLE = 'wptelegram-menu';

	/**
	 * Register the assets.
	 *
	 * @since    1.9.7
	 */
	public function register_assets() {

		$build_dir = $this->plugin()->dir( '/assets/build' );

		$js_dependencies = new JsDependencies( $build_dir );

		$assets = $this->plugin()->assets();

		foreach ( self::ASSET_ENTRIES as $name => $data ) {
			$entry = $data['entry'];

			// If we have external dependencies, register them first.
			if ( ! empty( $data['external-deps'] ) ) {
				foreach ( $data['external-deps'] as $handle => $src ) {
					wp_register_script(
						$handle,
						$src,
						[],
						$this->plugin()->version(),
						true
					);
				}
				$dependencies = array_merge( $js_dependencies->get( $entry ), array_keys( $data['external-deps'] ) );
			} else {
				$dependencies = $js_dependencies->get( $entry );
			}

			$assets->register_asset(
				$entry,
				[
					'handle'           => $this->plugin()->name() . '-' . $name,
					'dependencies'     => $dependencies,
					'css-dependencies' => $data['css-deps'] ?? [],
					'in-footer'        => $data['in-footer'] ?? true,
				]
			);
		}

		if ( ! defined( 'WPTELEGRAM_LOADED' ) ) {
			wp_register_style(
				self::WPTELEGRAM_MENU_HANDLE,
				$this->plugin()->url( sprintf( '/assets/static/css/admin-menu%s.css', wp_scripts_get_suffix() ) ),
				[],
				$this->plugin()->version(),
				'all'
			);
		}
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.9.0
	 * @param string $hook_suffix The current admin page.
	 */
	public function enqueue_admin_styles( $hook_suffix ) {

		if ( ! defined( 'WPTELEGRAM_LOADED' ) ) {
			wp_enqueue_style( self::WPTELEGRAM_MENU_HANDLE );
		}

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
	 * @since    1.9.0
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
	 * Add the data to DOM.
	 *
	 * @since 1.9.7
	 *
	 * @param string $handle The script handle to attach the data to.
	 * @param mixed  $data   The data to add.
	 * @param string $var    The JavaScript variable name to use.
	 *
	 * @return void
	 */
	public static function add_dom_data( $handle, $data, $var = 'wptelegram_login' ) {
		wp_add_inline_script(
			$handle,
			sprintf( 'var %s = %s;', $var, wp_json_encode( $data ) ),
			'before'
		);
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
				'description' => __( 'With this plugin, you can let the users login to your website with their Telegram and make it simple for them to get connected.', 'wptelegram-login' ),
			],
			'api'        => [
				'admin_url'      => admin_url(),
				'nonce'          => wp_create_nonce( 'wptelegram-login' ),
				'use'            => 'BROWSER', // or may be 'SERVER'?
				'rest_namespace' => 'wptelegram-login/v1',
				'wp_rest_url'    => esc_url_raw( rest_url() ),
			],
			'assets'     => [
				'logoUrl'   => $this->plugin()->url( '/assets/static/icons/icon-128x128.png' ),
				'tgIconUrl' => $this->plugin()->url( '/assets/static/icons/tg-icon.svg' ),
			],
			'uiData'     => [
				'show_if_user_is'   => self::get_show_if_user_is_options(),
				'lang'              => self::get_language_options(),
				'wptelegram_active' => defined( 'WPTELEGRAM_LOADED' ),
			],
			'i18n'       => Utils::get_jed_locale_data( 'wptelegram-login' ),
		];

		$settings = SettingsController::get_rest_settings();

		// Not to expose bot token to non-admins.
		if ( 'SETTINGS_PAGE' === $for && current_user_can( 'manage_options' ) ) {
			$data['savedSettings'] = $settings;
			// Add UI data for settings page.
			$data['uiData']['user_role'] = self::user_role_options_cb();
		}

		if ( 'BLOCKS' === $for ) {

			$data['assets'] = array_merge(
				$data['assets'],
				[
					'loginImageUrl'  => $this->plugin()->url( '/assets/static/icons/telegram-login.svg' ),
					'loginAvatarUrl' => $this->plugin()->url( '/assets/static/icons/telegram-login-avatar.svg' ),
				]
			);

			$data['savedSettings'] = array_intersect_key(
				$settings,
				array_flip(
					[
						'button_style',
						'show_user_photo',
						'corner_radius',
						'show_if_user_is',
					]
				)
			);
		}

		return apply_filters( 'wptelegram_login_assets_dom_data', $data, $for, $this->plugin() );
	}

	/**
	 * Callback for user_role option.
	 *
	 * @return array
	 */
	public static function user_role_options_cb() {
		// get_editable_roles may not exist for Block Widgets.
		if ( ! function_exists( 'get_editable_roles' ) ) {
			require_once ABSPATH . 'wp-admin/includes/user.php';
		}
		$data = [];

		foreach ( get_editable_roles() as $role_name => $role_info ) {
			$data[] = [
				'value' => $role_name,
				'label' => translate_user_role( $role_info['name'] ),
			];
		}
		return $data;
	}

	/**
	 * Get options for show_if_user_is dropdown.
	 *
	 * @return array
	 */
	public static function get_show_if_user_is_options() {

		$data = [
			[
				'value' => '0',
				'label' => __( 'Any', 'wptelegram-login' ),
			],
			[
				'value' => 'logged_out',
				'label' => __( 'Logged out', 'wptelegram-login' ),
			],
			[
				'value' => 'logged_in',
				'label' => __( 'Logged in', 'wptelegram-login' ),
			],
		];

		return array_merge( $data, self::user_role_options_cb() );
	}

	/**
	 * Get options for lang dropdown.
	 *
	 * @return array
	 */
	public static function get_language_options() {

		require_once ABSPATH . 'wp-admin/includes/translation-install.php';

		$translations = wp_get_available_translations();

		$langs = [];

		foreach ( $translations as $translation ) {
			$iso = current( $translation['iso'] );

			if ( 'en' === $iso ) {
				continue;
			}

			$total_pieces = count( explode( ' ', $translation['english_name'] ) );

			$langs[ $iso ][ $total_pieces ] = $translation;
		}

		$data = [
			[
				'value' => 'en',
				'label' => 'English (en)',
			],
		];

		foreach ( $langs as $iso => $lang_list ) {
			ksort( $lang_list );

			$translation = array_shift( $lang_list );

			// Remove everything inside the parentheses.
			$name = preg_replace( '/\s+\(.+$/', '', $translation['english_name'] );

			$label = sprintf( '%s (%s)', $name, $iso );

			$data[] = [
				'value' => $iso,
				'label' => $label,
			];
		}

		usort(
			$data,
			function ( $a, $b ) {
				return strcmp( $a['label'], $b['label'] );
			}
		);

		array_unshift(
			$data,
			[
				'value' => '',
				'label' => __(
					'Default',
					'wptelegram-login'
				),
			]
		);

		return apply_filters( 'wptelegram_login_language_options', $data, $translations );
	}

	/**
	 * Register the scripts for the login page
	 *
	 * @since    1.9.0
	 */
	public function login_enqueue_scripts() {

		$hide_on_default = WPTG_Login()->options()->get( 'hide_on_default' );

		if ( $hide_on_default || ! $this->plugin()->assets()->is_registered( self::WP_LOGIN_ENTRY ) ) {
			return;
		}

		[$handle] = $this->plugin()->assets()->get_entry_handles( self::WP_LOGIN_ENTRY );

		wp_enqueue_script( $handle );

		$styles = $this->plugin()->assets()->get_entry_handles( self::WP_LOGIN_ENTRY, 'styles' );

		foreach ( $styles as $handle ) {
			wp_enqueue_style( $handle );
		}
	}

	/**
	 * Register the scripts for public facing pages
	 *
	 * @since    1.10.4
	 */
	public function enqueue_public_scripts() {
		if ( empty( $_SERVER['QUERY_STRING'] ) ) {
			return;
		}

		// Using $_SERVER['QUERY_STRING'] to avoid a bug in Telegram Mini Apps which pass HTML encoded query string.
		$query_string = html_entity_decode( sanitize_text_field( wp_unslash( $_SERVER['QUERY_STRING'] ) ) );

		$query_params = wp_parse_args(
			$query_string,
			[
				'action'        => '',
				'confirm_login' => '1',
				'redirect_to'   => '',
			]
		);

		if ( 'wptelegram_login_webapp' === $query_params['action'] && $this->plugin()->assets()->is_registered( self::WEB_APP_LOGIN_ENTRY ) ) {

			[$handle] = $this->plugin()->assets()->get_entry_handles( self::WEB_APP_LOGIN_ENTRY );

			// This should not be needed, but it doesn't seem to work without loading the dependency.
			wp_enqueue_script( self::WEB_APP_EXTERNAL_SCRIPT_HANDLE );
			wp_enqueue_script( $handle );

			$redirect_to       = esc_url( $query_params['redirect_to'] );
			$confirm_login     = (bool) $query_params['confirm_login'];
			$is_user_logged_in = is_user_logged_in();
			$login_auth_url    = add_query_arg(
				[
					'action'      => 'wptelegram_login',
					'source'      => 'WebAppData',
					'redirect_to' => $redirect_to,
				],
				site_url()
			);

			$i18n = [
				'popup' => [
					'title'   => __( 'Login with Telegram', 'wptelegram-login' ),
					'message' => __( 'Do you want to login via Telegram for a better experience?', 'wptelegram-login' ),
					'buttons' => [
						[
							'id'   => 'login',
							'text' => __( 'Login', 'wptelegram-login' ),
							'type' => 'default',
						],
						[
							'id'   => 'cancel',
							'text' => __( 'Cancel', 'wptelegram-login' ),
							'type' => 'cancel',
						],
					],
				],
			];

			$data = compact( 'is_user_logged_in', 'login_auth_url', 'confirm_login', 'i18n' );

			$data = apply_filters( 'wptelegram_login_web_app_login_data', $data );

			self::add_dom_data( $handle, $data, 'wptelegram_web_app_data' );
		}
	}

	/**
	 * Enqueue assets for the Gutenberg block
	 *
	 * @since 1.5.0
	 * @param string $hook_suffix The current admin page.
	 */
	public function is_settings_page( $hook_suffix ) {
		return ( false !== strpos( $hook_suffix, '_page_' . $this->plugin()->name() ) );
	}

	/**
	 * Enqueue assets for the Gutenberg block
	 *
	 * @since    1.4.1
	 */
	public function enqueue_block_editor_assets() {
		if ( $this->plugin()->assets()->is_registered( self::BLOCKS_ENTRY ) ) {
			[$handle] = $this->plugin()->assets()->get_entry_handles( self::BLOCKS_ENTRY );

			wp_enqueue_script( $handle );

			$data = $this->get_dom_data( 'BLOCKS' );

			self::add_dom_data( $handle, $data );

			$styles = $this->plugin()->assets()->get_entry_handles( self::BLOCKS_ENTRY, 'styles' );

			foreach ( $styles as $handle ) {
				wp_enqueue_style( $handle );
			}
		}
	}
}
