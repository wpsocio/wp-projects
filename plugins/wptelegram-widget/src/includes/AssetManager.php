<?php
/**
 * The assets manager of the plugin.
 *
 * @link       https://wpsocio.com
 * @since      2.0.0
 *
 * @package    WPTelegram\Widget
 * @subpackage WPTelegram\Widget\includes
 */

namespace WPTelegram\Widget\includes;

use WPTelegram\Widget\shared\shortcodes\LegacyWidget;
use WPTelegram\Widget\includes\restApi\RESTController;
use WPTelegram\Widget\includes\restApi\SettingsController;
use Kucrut\Vite;

/**
 * The assets manager of the plugin.
 *
 * Loads the plugin assets.
 *
 * @package    WPTelegram\Widget
 * @subpackage WPTelegram\Widget\includes
 * @author     WP Socio
 */
class AssetManager extends BaseClass {

	const ADMIN_SETTINGS_ENTRY = 'js/settings/index.ts';
	const BLOCKS_ENTRY         = 'js/blocks/index.ts';
	const PUBLIC_WIDGET_ENTRY  = 'js/public/index.ts';

	const ASSET_ENTRIES = [
		'blocks'         => [
			'entry'    => self::BLOCKS_ENTRY,
			'css-deps' => [
				'wp-components',
			],
		],
		'admin-settings' => [
			'entry'             => self::ADMIN_SETTINGS_ENTRY,
			'internal-css-deps' => [
				self::BLOCKS_ENTRY,
			],
		],
		'public'         => [
			'entry' => self::PUBLIC_WIDGET_ENTRY,
		],
	];

	const WPTELEGRAM_MENU_HANDLE = 'wptelegram-menu';

	/**
	 * The registered handles.
	 *
	 * @since x.y.z
	 * @var   array $registered_handles The registered handles.
	 */
	private $registered_handles = [];

	/**
	 * Register the assets.
	 *
	 * @since    2.1.0
	 */
	public function register_assets() {

		$assets = $this->plugin()->assets();

		$build_dir = $assets->build_path();

		foreach ( self::ASSET_ENTRIES as $name => $data ) {
			$entry    = $data['entry'];
			$css_deps = $data['css-deps'] ?? [];

			if ( ! empty( $data['internal-css-deps'] ) ) {
				foreach ( $data['internal-css-deps'] as $css_entry ) {
					if ( ! empty( $this->registered_handles[ $css_entry ]['styles'] ) ) {
						$css_deps = array_merge( $css_deps, $this->registered_handles[ $css_entry ]['styles'] );
					}
				}
			}
			$dependencies = $assets->get_dependencies( $entry );

			$this->registered_handles[ $entry ] = Vite\register_asset(
				$build_dir,
				$entry,
				[
					'handle'           => $this->plugin()->name() . '-' . $name,
					'dependencies'     => $dependencies,
					'css-dependencies' => $css_deps,
					'in-footer'        => $data['in-footer'] ?? true,
				]
			);
		}

		if ( ! defined( 'WPTELEGRAM_LOADED' ) ) {
			wp_register_style(
				self::WPTELEGRAM_MENU_HANDLE,
				$assets->url( sprintf( '/static/css/admin-menu%s.css', wp_scripts_get_suffix() ) ),
				[],
				$this->plugin()->version(),
				'all'
			);
		}

		if ( ! empty( $this->registered_handles[ self::BLOCKS_ENTRY ]['styles'] ) ) {
			[$handle] = $this->registered_handles[ self::BLOCKS_ENTRY ]['styles'];

			$style = sprintf(
				':root {%1$s: %2$s;%3$s: %4$s}',
				'--wptelegram-widget-join-link-bg-color',
				$this->plugin()->options()->get_path( 'join_link.bgcolor', '#389ce9' ),
				'--wptelegram-widget-join-link-color',
				$this->plugin()->options()->get_path( 'join_link.text_color', '#fff' )
			);

			wp_add_inline_style( $handle, $style );
		}
	}

	/**
	 * Register the stylesheets for the public area.
	 *
	 * @since    2.0.0
	 */
	public function enqueue_public_styles() {

		if ( ! empty( $this->registered_handles[ self::PUBLIC_WIDGET_ENTRY ]['styles'] ) ) {
			[$handle] = $this->registered_handles[ self::PUBLIC_WIDGET_ENTRY ]['styles'];

			wp_enqueue_style( $handle );
		}
	}

	/**
	 * Register the stylesheets for the public area.
	 *
	 * @since    2.0.0
	 */
	public function enqueue_public_scripts() {
		if ( ! empty( $this->registered_handles[ self::PUBLIC_WIDGET_ENTRY ]['scripts'] ) ) {
			[$handle] = $this->registered_handles[ self::PUBLIC_WIDGET_ENTRY ]['scripts'];

			wp_enqueue_script( $handle );
		}
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    2.0.0
	 * @param string $hook_suffix The current admin page.
	 */
	public function enqueue_admin_styles( $hook_suffix ) {

		if ( ! defined( 'WPTELEGRAM_LOADED' ) ) {
			wp_enqueue_style( self::WPTELEGRAM_MENU_HANDLE );
		}

		// Load only on settings page.
		if ( $this->is_settings_page( $hook_suffix ) ) {
			$admin_styles = $this->registered_handles[ self::ADMIN_SETTINGS_ENTRY ]['styles'] ?? [];

			foreach ( $admin_styles as $handle ) {
				wp_enqueue_style( $handle );
			}
		}
	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    2.0.0
	 * @param string $hook_suffix The current admin page.
	 */
	public function enqueue_admin_scripts( $hook_suffix ) {
		// Load only on settings page.
		if ( $this->is_settings_page( $hook_suffix ) && ! empty( $this->registered_handles[ self::ADMIN_SETTINGS_ENTRY ]['scripts'] ) ) {
			[$handle] = $this->registered_handles[ self::ADMIN_SETTINGS_ENTRY ]['scripts'];

			wp_enqueue_script( $handle );

			// Pass data to JS.
			$data = $this->get_dom_data();

			self::add_dom_data( $handle, $data );
		}
	}

	/**
	 * Add the data to DOM.
	 *
	 * @since 2.1.0
	 *
	 * @param string $handle The script handle to attach the data to.
	 * @param mixed  $data   The data to add.
	 * @param string $var    The JavaScript variable name to use.
	 *
	 * @return void
	 */
	public static function add_dom_data( $handle, $data, $var = 'wptelegram_widget' ) {
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
				'description' => __( 'With this plugin, you can let the users widget to your website with their Telegram and make it simple for them to get connected.', 'wptelegram-widget' ),
			],
			'api'        => [
				'admin_url'      => admin_url(),
				'nonce'          => wp_create_nonce( 'wptelegram-widget' ),
				'use'            => 'SERVER', // or may be 'BROWSER'?
				'rest_namespace' => RESTController::REST_NAMESPACE,
				'wp_rest_url'    => esc_url_raw( rest_url() ),
			],
			'assets'     => [
				'logoUrl'   => $this->plugin()->assets()->url( '/static/icons/icon-128x128.png' ),
				'tgIconUrl' => $this->plugin()->assets()->url( '/static/icons/tg-icon.svg' ),
			],
			'uiData'     => [],
			'i18n'       => Utils::get_jed_locale_data( 'wptelegram-widget' ),
		];

		$settings = SettingsController::get_default_settings();

		// Not to expose bot token to non-admins.
		if ( 'SETTINGS_PAGE' === $for && current_user_can( 'manage_options' ) ) {
			$data['savedSettings'] = $settings;

			$data['uiData']['post_types'] = $this->get_post_type_options();

			$data['assets']['pullUpdatesUrl'] = add_query_arg( [ 'action' => 'wptelegram_widget_pull_updates' ], site_url() );
		}

		if ( 'BLOCKS' === $for ) {

			$data['assets']['message_view_url'] = LegacyWidget::get_single_message_embed_url( '%username%', '%message_id%', '%userpic%' );

			$data['uiData'] = array_merge(
				$data['uiData'],
				[
					'join_link_url'  => $this->plugin()->options()->get_path( 'join_link.url' ),
					'join_link_text' => $this->plugin()->options()->get_path( 'join_link.text' ),
				]
			);
		}

		return apply_filters( 'wptelegram_widget_assets_dom_data', $data, $for, $this->plugin() );
	}

	/**
	 * Get the registered post types.
	 *
	 * @since  1.9.0
	 * @return array
	 */
	public function get_post_type_options() {

		$options = [];

		$post_types = get_post_types( [ 'public' => true ], 'objects' );

		foreach ( $post_types  as $post_type ) {
			if ( 'attachment' !== $post_type->name ) {
				$options[] = [
					'value' => $post_type->name,
					'label' => "{$post_type->labels->singular_name} ({$post_type->name})",
				];
			}
		}

		return apply_filters( 'wptelegram_widget_post_type_options', $options, $post_types );
	}

	/**
	 * Enqueue assets for the Gutenberg block
	 *
	 * @since 2.0.0
	 * @param string $hook_suffix The current admin page.
	 */
	public function is_settings_page( $hook_suffix ) {
		return ( false !== strpos( $hook_suffix, '_page_' . $this->plugin()->name() ) );
	}

	/**
	 * Enqueue assets for the Gutenberg block
	 *
	 * @since    2.0.0
	 */
	public function enqueue_block_editor_assets() {
		if ( ! empty( $this->registered_handles[ self::BLOCKS_ENTRY ]['scripts'] ) ) {
			[$handle] = $this->registered_handles[ self::BLOCKS_ENTRY ]['scripts'];

			wp_enqueue_script( $handle );

			$data = $this->get_dom_data( 'BLOCKS' );

			self::add_dom_data( $handle, $data );

			$styles = $this->registered_handles[ self::BLOCKS_ENTRY ]['styles'] ?? [];

			foreach ( $styles as $handle ) {
				wp_enqueue_style( $handle );
			}
		}
	}
}