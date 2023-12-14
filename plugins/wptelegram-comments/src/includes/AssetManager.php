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
use Kucrut\Vite;

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
	 * @since    1.1.3
	 */
	public function register_assets() {

		$assets = $this->plugin()->assets();

		$build_dir = $assets->build_path();

		foreach ( self::ASSET_ENTRIES as $name => $data ) {
			$entry = $data['entry'];

			$this->registered_handles[ $entry ] = Vite\register_asset(
				$build_dir,
				$entry,
				[
					'handle'           => $this->plugin()->name() . '-' . $name,
					'dependencies'     => $assets->get_dependencies( $entry ),
					'css-dependencies' => $data['css-deps'] ?? [],
					'in-footer'        => $data['in-footer'] ?? true,
				]
			);
		}

		if ( ! defined( 'WPTELEGRAM_LOADED' ) ) {
			wp_register_style(
				'wptelegram-menu',
				$assets->url( sprintf( '/static/css/admin-menu%s.css', wp_scripts_get_suffix() ) ),
				[],
				$this->plugin()->version(),
				'all'
			);
		}
	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.1.0
	 * @param string $hook_suffix The current admin page.
	 */
	public function enqueue_admin_styles( $hook_suffix ) {

		if ( ! defined( 'WPTELEGRAM_LOADED' ) ) {
			wp_enqueue_style( 'wptelegram-menu' );
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
	 * @since    1.1.0
	 * @param string $hook_suffix The current admin page.
	 */
	public function enqueue_admin_scripts( $hook_suffix ) {
		// Load only on settings page.
		if ( $this->is_settings_page( $hook_suffix ) && ! empty( $this->registered_handles[ self::ADMIN_SETTINGS_ENTRY ]['scripts'] ) ) {
			[$handle] = $this->registered_handles[ self::ADMIN_SETTINGS_ENTRY ]['scripts'];

			wp_enqueue_script( $handle );

			// Pass data to JS.
			$data = $this->get_dom_data();
			// Not to expose bot token to non-admins.
			if ( current_user_can( 'manage_options' ) ) {
				$data['savedSettings'] = SettingsController::get_default_settings();
			}
			$data['uiData']['post_types'] = $this->get_post_type_options();

			self::add_dom_data( $handle, $data );
		}
	}

	/**
	 * Add the data to DOM.
	 *
	 * @since 1.1.3
	 *
	 * @param string $handle The script handle to attach the data to.
	 * @param mixed  $data   The data to add.
	 * @param string $var    The JavaScript variable name to use.
	 *
	 * @return void
	 */
	public static function add_dom_data( $handle, $data, $var = 'wptelegram_comments' ) {
		wp_add_inline_script(
			$handle,
			sprintf( 'var %s = %s;', $var, wp_json_encode( $data ) ),
			'before'
		);
	}

	/**
	 * Get the common DOM data.
	 *
	 * @return array
	 */
	private function get_dom_data() {
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
				'logoUrl'   => $this->plugin()->assets()->url( '/static/icons/icon-128x128.png' ),
				'tgIconUrl' => $this->plugin()->assets()->url( '/static/icons/tg-icon.svg' ),
			],
			'uiData'     => [],
			'i18n'       => Utils::get_jed_locale_data( 'wptelegram-comments' ),
		];

		return $data;
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
