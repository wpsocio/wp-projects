<?php
/**
 * IframedWPAdmin for WordPress.
 *
 * This is inspired by the iframed Block Editor in WordPress.
 *
 * @link https://wpsocio.com
 *
 * @package WPSocio\WPUtils
 */

namespace WPSocio\WPUtils;

use WP_Scripts;
use WP_Styles;

/**
 * Class IframedWPAdmin
 *
 * @package    WPSocio\WPUtils
 * @author     WP Socio
 */
class IframedWPAdmin {

	/**
	 * The assets entry.
	 *
	 * @var string
	 */
	const ENTRY = 'js/iframed-wp-admin/index.tsx';

	/**
	 *  The script handle.
	 *
	 *  @var string
	 */
	const HANDLE = 'wpsocio-iframed-wp-admin';

	/**
	 *  The path to this package's directory.
	 *
	 *  @var string
	 */
	protected $package_dir_path;

	/**
	 *  The URL to this package's directory.
	 *
	 *  @var string
	 */
	protected $package_dir_url;

	/**
	 *  The assets for the iframed WordPress admin.
	 *
	 *  @var ViteWPReactAssets
	 */
	protected $assets;

	/**
	 * The constructor.
	 *
	 *  @param string $package_dir_path The path to this package's directory.
	 *  @param string $package_dir_url The URL to this package's directory.
	 *
	 * @return void
	 */
	public function __construct( $package_dir_path, $package_dir_url ) {
		$this->package_dir_path = untrailingslashit( $package_dir_path );
		$this->package_dir_url  = untrailingslashit( $package_dir_url );

		$this->assets = new ViteWPReactAssets(
			"{$this->package_dir_path}/dist",
			"{$this->package_dir_url}/dist"
		);
	}

	/**
	 *  Get the path to the root directory.
	 *
	 *  @return string The path to the root directory.
	 */
	protected function get_root_dir() {
		return dirname( __DIR__ );
	}

	/**
	 * Register the assets.
	 */
	public function register_assets() {

		$dependencies = new JsDependencies( "{$this->package_dir_path}/dist" );

		$this->assets->register(
			self::ENTRY,
			[
				'handle'              => self::HANDLE,
				'is-global'           => true,
				'script-dependencies' => $dependencies->get( self::ENTRY ),
			]
		);
	}

	/**
	 * Enqueue the assets for the iframed WordPress admin.
	 *
	 * @param string $id The unique identifier for the iframe instance.
	 * @param array  $options Optional. Additional options for the instance.
	 *
	 * @return void
	 */
	public function enqueue_assets( $id, $options = [] ) {

		$this->assets->enqueue( self::ENTRY );

		$handle = $this->assets->get_entry_script_handle( self::ENTRY );

		if ( $handle ) {
			$data = sprintf(
				'window.WPSocioIframedWPAdmin = %s;',
				wp_json_encode(
					array_merge(
						$options,
						[
							'assets' => $this->get_assets_for_iframe( $id ),
						]
					)
				)
			);

			wp_add_inline_script( $handle, $data, 'before' );
		}
	}

	/**
	 * Render the root element for the iframed WordPress admin.
	 */
	public function render_root() {
		echo '<div id="wpsocio-iframed-wp-admin-root"></div>';
	}

	/**
	 * Get the assets for the iframed WordPress admin.
	 *
	 * @param string $id The unique identifier for the iframe instance.
	 *
	 * @return array An associative array containing 'styles' and 'scripts'.
	 */
	public function get_assets_for_iframe( $id ) {
		global $wp_styles, $wp_scripts;

		// Keep track of the styles and scripts instance to restore later.
		$current_wp_styles  = $wp_styles;
		$current_wp_scripts = $wp_scripts;

        // phpcs:disable WordPress.WP.GlobalVariablesOverride.Prohibited
		// Create new instances to collect the assets.
		$wp_styles  = new WP_Styles();
		$wp_scripts = new WP_Scripts();

		/*
		* Register all currently registered styles and scripts. The actions that
		* follow enqueue assets, but don't necessarily register them.
		*/
		$wp_styles->registered  = $current_wp_styles->registered;
		$wp_scripts->registered = $current_wp_scripts->registered;

		do_action( 'wpsocio_iframed_wp_admin_enqueue_assets', $id );

		/**
		 * Remove the deprecated `print_emoji_styles` handler.
		 * It avoids breaking style generation with a deprecation message.
		 */
		$has_emoji_styles = has_action( 'wp_print_styles', 'print_emoji_styles' );
		if ( $has_emoji_styles ) {
			remove_action( 'wp_print_styles', 'print_emoji_styles' );
		}

		ob_start();
		wp_print_styles();
		wp_print_font_faces();
		$styles = ob_get_clean();

		ob_start();
		wp_print_head_scripts();
		wp_print_footer_scripts();
		$scripts = ob_get_clean();

		// Restore the original instances.
		$wp_styles  = $current_wp_styles;
		$wp_scripts = $current_wp_scripts;
        // phpcs:enable WordPress.WP.GlobalVariablesOverride.Prohibited

		return [
			'styles'  => $styles,
			'scripts' => $scripts,
		];
	}
}
