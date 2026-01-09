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
use WPSocio\WPUtils\JsDependencies;

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
			'entry'      => self::BLOCKS_ENTRY,
			'style-deps' => [
				'wp-components',
			],
		],
		'admin-settings' => [
			'entry'               => self::ADMIN_SETTINGS_ENTRY,
			'internal-style-deps' => [
				self::BLOCKS_ENTRY,
			],
		],
		'public'         => [
			'entry' => self::PUBLIC_WIDGET_ENTRY,
		],
	];

	const WPTELEGRAM_MENU_HANDLE = 'wptelegram-menu';

	/**
	 * Register the assets.
	 *
	 * @since    2.1.0
	 */
	public function register_assets() {

		$build_dir = $this->plugin()->dir( '/assets/build' );

		$dependencies = new JsDependencies( $build_dir );

		$assets = $this->plugin()->assets();

		foreach ( self::ASSET_ENTRIES as $name => $data ) {
			$entry      = $data['entry'];
			$style_deps = $data['style-deps'] ?? [];

			if ( ! empty( $data['internal-style-deps'] ) ) {
				foreach ( $data['internal-style-deps'] as $style_entry ) {

					if ( $assets->is_registered( $style_entry, 'style' ) ) {
						$style_deps = array_merge( $style_deps, $assets->get_entry_style_handles( $style_entry ) );
					}
				}
			}

			$assets->register(
				$entry,
				[
					'handle'              => $this->plugin()->name() . '-' . $name,
					'script-dependencies' => $dependencies->get( $entry ),
					'style-dependencies'  => $style_deps,
					'script-args'         => $data['in-footer'] ?? true,
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

		if ( $assets->is_registered( self::BLOCKS_ENTRY ) ) {
			[$handle] = $assets->get_entry_style_handles( self::BLOCKS_ENTRY );

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
	 * Add inline script for a given entry.
	 *
	 * @param string $entry Entrypoint.
	 *
	 * @return void
	 */
	public function add_inline_script( string $entry ): void {
		$handle = $this->plugin()->assets()->get_entry_script_handle( $entry );

		if ( $handle ) {
			$data = $this->get_inline_script_data_str( $entry );

			wp_add_inline_script( $handle, $data, 'before' );
		}
	}

	/**
	 * Enqueue the assets for the public area.
	 *
	 * @since    2.1.12
	 */
	public function enqueue_public_assets() {

		$this->plugin()->assets()->enqueue( self::PUBLIC_WIDGET_ENTRY );
	}

	/**
	 * Enqueue the assets for the admin area.
	 *
	 * @since    2.1.12
	 * @param string $hook_suffix The current admin page.
	 */
	public function enqueue_admin_assets( $hook_suffix ) {

		if ( ! defined( 'WPTELEGRAM_LOADED' ) ) {
			wp_enqueue_style( self::WPTELEGRAM_MENU_HANDLE );
		}

		// Load only on settings page.
		if ( $this->is_settings_page( $hook_suffix ) ) {
			$this->plugin()->assets()->enqueue(
				self::ADMIN_SETTINGS_ENTRY,
				[
					'inline-style' => [
						'dev-dependency' => 'wp-admin',
						/**
						 * We need to move common css to the wp layer
						 * to avoid it overriding Tailwind preflight CSS.
						 * We will disable the actual loading of the common CSS via JS.
						 */
						'data'           => sprintf(
							'@import url("%s") layer(wp);',
							wp_admin_css_uri( 'css/common' )
						),
					],
				]
			);
			$this->add_inline_script( self::ADMIN_SETTINGS_ENTRY );
		}
	}

	/**
	 * Get the inline script data as a string.
	 *
	 * @param string $for The JS entry point for which the data is needed.
	 *
	 * @return string
	 */
	public function get_inline_script_data_str( string $for ): string {

		$data = $this->get_inline_script_data( $for );

		return $data ? sprintf( 'var %s = %s;', $this->plugin()->name(), wp_json_encode( $data ) ) : '';
	}

	/**
	 * Get the inline script data.
	 *
	 * @param string $for The JS entry point for which the data is needed.
	 *
	 * @return array
	 */
	public function get_inline_script_data( string $for ) {
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
				'logoUrl'   => $this->plugin()->url( '/assets/static/icons/icon-128x128.png' ),
				'tgIconUrl' => $this->plugin()->url( '/assets/static/icons/tg-icon.svg' ),
			],
			'uiData'     => [],
			'i18n'       => Utils::get_jed_locale_data( 'wptelegram-widget' ),
		];

		// Not to expose bot token to non-admins.
		if ( self::ADMIN_SETTINGS_ENTRY === $for && current_user_can( 'manage_options' ) ) {

			$bot_token = $this->plugin()->options()->get_path( 'legacy_widget.bot_token' );

			$data['savedSettings'] = SettingsController::get_default_settings();

			$data['uiData']['post_types'] = $this->get_post_type_options();

			$data['assets']['pullUpdatesUrl'] = add_query_arg(
				[
					'action' => 'wptelegram_widget_pull_updates',
					'secret' => $bot_token ? Utils::generate_secret( $bot_token ) : null,
				],
				site_url()
			);
		}

		if ( self::BLOCKS_ENTRY === $for ) {

			$data['assets']['message_view_url'] = LegacyWidget::get_single_message_embed_url( '%username%', '%message_id%', '%userpic%' );

			$data['uiData'] = array_merge(
				$data['uiData'],
				[
					'join_link_url'  => $this->plugin()->options()->get_path( 'join_link.url' ),
					'join_link_text' => $this->plugin()->options()->get_path( 'join_link.text' ),
				]
			);
		}

		return apply_filters( 'wptelegram_widget_inline_script_data', $data, $for, $this->plugin() );
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
	 * Check if the current page is the settings page.
	 *
	 * @since 2.0.0
	 * @param string $hook_suffix The current admin page.
	 */
	public function is_settings_page( $hook_suffix ) {
		return ( false !== strpos( $hook_suffix, '_page_' . $this->plugin()->name() ) );
	}

	/**
	 * Enqueue assets for blocks
	 *
	 * @since 2.1.12
	 */
	public function enqueue_block_assets() {

		$is_block_editor = (bool) did_action( 'enqueue_block_editor_assets' );

		$this->plugin()->assets()->enqueue(
			self::BLOCKS_ENTRY,
			// We need JS only for the block editor.
			[ 'skip-script' => ! $is_block_editor ]
		);
		$this->add_inline_script( self::BLOCKS_ENTRY );
	}
}
