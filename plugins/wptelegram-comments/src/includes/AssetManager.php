<?php
/**
 * The assets manager of the plugin.
 *
 * @link       https://wpsocio.com
 * @since      1.1.0
 *
 * @package    WPTelegram\Comments
 * @subpackage WPTelegram\Comments\includes
 */

namespace WPTelegram\Comments\includes;

use WPTelegram\Comments\includes\restApi\SettingsController;
use WPSocio\WPUtils\JsDependencies;

/**
 * The assets manager of the plugin.
 *
 * Loads the plugin assets.
 *
 * @package    WPTelegram\Comments
 * @subpackage WPTelegram\Comments\includes
 * @author     WP Socio
 */
class AssetManager extends BaseClass {

	const ADMIN_SETTINGS_ENTRY = 'js/settings/index.ts';

	const ASSET_ENTRIES = [
		'admin-settings' => [
			'entry' => self::ADMIN_SETTINGS_ENTRY,
		],
	];

	const WPTELEGRAM_MENU_HANDLE = 'wptelegram-menu';

	/**
	 * Register the assets.
	 *
	 * @since    1.1.3
	 */
	public function register_assets() {

		$build_dir = $this->plugin()->dir( '/assets/build' );

		$dependencies = new JsDependencies( $build_dir );

		$assets = $this->plugin()->assets();

		foreach ( self::ASSET_ENTRIES as $name => $data ) {
			$entry = $data['entry'];

			$assets->register(
				$entry,
				[
					'handle'              => $this->plugin()->name() . '-' . $name,
					'script-dependencies' => $dependencies->get( $entry ),
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
	 * Enqueue the assets for the admin area.
	 *
	 * @since    1.1.10
	 * @param string $hook_suffix The current admin page.
	 */
	public function enqueue_admin_assets( $hook_suffix ) {

		if ( ! defined( 'WPTELEGRAM_LOADED' ) ) {
			wp_enqueue_style( self::WPTELEGRAM_MENU_HANDLE );
		}

		$assets = $this->plugin()->assets();

		// Load only on settings page.
		if ( $this->is_settings_page( $hook_suffix ) ) {

			$assets->enqueue( self::ADMIN_SETTINGS_ENTRY );
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
				'description' => __( 'With this plugin, you can add comments to posts/pages on your WordPress website by using Telegram Comments Widget.', 'wptelegram-comments' ),
			],
			'api'        => [
				'admin_url'      => admin_url(),
				'nonce'          => wp_create_nonce( 'wptelegram-comments' ),
				'rest_namespace' => 'wptelegram-comments/v1',
				'wp_rest_url'    => esc_url_raw( rest_url() ),
			],
			'assets'     => [
				'logoUrl'   => $this->plugin()->url( '/assets/static/icons/icon-128x128.png' ),
				'tgIconUrl' => $this->plugin()->url( '/assets/static/icons/tg-icon.svg' ),
			],
			'uiData'     => [],
			'i18n'       => Utils::get_jed_locale_data( 'wptelegram-comments' ),
		];

		if ( self::ADMIN_SETTINGS_ENTRY === $for && current_user_can( 'manage_options' ) ) {
			$data['savedSettings']        = SettingsController::get_default_settings();
			$data['uiData']['post_types'] = $this->get_post_type_options();
		}

		return apply_filters( 'wptelegram_comments_inline_script_data', $data, $for, $this->plugin() );
	}

	/**
	 * Get the registered post types.
	 *
	 * @since  1.1.0
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

		return apply_filters( 'wptelegram_comments_post_type_options', $options, $post_types );
	}

	/**
	 * Enqueue assets for the Gutenberg block
	 *
	 * @since 1.1.0
	 * @param string $hook_suffix The current admin page.
	 */
	public function is_settings_page( $hook_suffix ) {
		return ( false !== strpos( $hook_suffix, '_page_' . $this->plugin()->name() ) );
	}
}
