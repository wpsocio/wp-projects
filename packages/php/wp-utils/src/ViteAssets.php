<?php
/**
 * Provides vite assets related functions for WordPress.
 *
 * Inspired by: kucrut/vite-for-wp
 * Parts of this file are copied from kucrut/vite-for-wp to enhance functionality.
 *
 * @link       https://wpsocio.com
 *
 * @package WPSocio\WPUtils
 *
 * phpcs:disable WordPress.WP.EnqueuedResourceParameters.MissingVersion
 */

namespace WPSocio\WPUtils;

use Exception;
use WP_HTML_Tag_Processor;


/**
 * Class ViteAssets
 *
 * @package    WPSocio\WPUtils
 * @author     WP Socio
 */
class ViteAssets {

	const DEV_CLIENT_HANDLE = 'vite-assets-dev-client';

	/**
	 * Assets directory path
	 *
	 * @var string
	 */
	protected string $assets_path;

	/**
	 * Assets directory URL
	 *
	 * @var string
	 */
	protected string $assets_url;

	/**
	 * Configuration options
	 *
	 * @var array
	 */
	protected array $config;

	/**
	 * Manifests cache
	 *
	 * @var array
	 */
	protected static $manifests = [];

	/**
	 * React refresh preamble printed ports
	 *
	 * @var array
	 */
	protected static $preamble_printed_ports = [];

	/**
	 * The registered assets.
	 *
	 * @var array
	 */
	private $registered_assets = [];

	/**
	 * ViteAssets constructor.
	 *
	 * @param string $assets_path Path to assets directory.
	 * @param string $assets_url  URL to assets directory.
	 * @param array  $config     Configuration options.
	 */
	public function __construct( string $assets_path, string $assets_url, array $config = [] ) {
		$this->assets_path = untrailingslashit( $assets_path );
		$this->assets_url  = untrailingslashit( $assets_url );

		$default_config = [
			'prod-manifest' => '.vite/manifest.json',
			'dev-manifest'  => '.vite/dev-server.json',
		];

		$this->config = wp_parse_args( $config, $default_config );
	}

	/**
	 * Get the registered assets.
	 *
	 * @return array
	 */
	public function get_registered_assets(): array {
		return $this->registered_assets;
	}

	/**
	 * Get the registered handles for a given entry.
	 *
	 * @param string $entry Entry name.
	 * @param string $in    Asset type (scripts or styles).
	 *
	 * @return array
	 */
	public function get_entry_handles( string $entry, $in = 'scripts' ): array {
		return $this->registered_assets[ $entry ][ $in ] ?? [];
	}

	/**
	 * Whether a handle is registered.
	 *
	 * @param string $entry Entry name.
	 * @param string $in    Asset type (scripts or styles).
	 * @return bool
	 */
	public function is_registered( string $entry, string $in = 'scripts' ): bool {
		return ! empty( $this->registered_assets[ $entry ][ $in ] );
	}

	/**
	 * Get manifest data
	 *
	 * @throws Exception Exception is thrown when the file doesn't exist, unreadble, or contains invalid data.
	 *
	 * @return object Object containing manifest type and data.
	 */
	public function get_manifest(): object {

		$file_names = [
			$this->config['dev-manifest'],
			$this->config['prod-manifest'],
		];

		foreach ( $file_names as $file_name ) {
			$is_dev        = $file_name === $this->config['dev-manifest'];
			$manifest_path = "{$this->assets_path}/{$file_name}";

			if ( isset( self::$manifests[ $manifest_path ] ) ) {
				return self::$manifests[ $manifest_path ];
			}

			if ( is_file( $manifest_path ) && is_readable( $manifest_path ) ) {
				break;
			}

			unset( $manifest_path );
		}

		if ( ! isset( $manifest_path ) ) {
			throw new Exception( esc_html( sprintf( '[ViteAssets] No manifest file found in %s.', $this->assets_path ) ) );
		}

		$manifest = wp_json_file_decode( $manifest_path );

		if ( ! $manifest ) {
			throw new Exception( esc_html( sprintf( '[ViteAssets] Failed to read manifest file %s.', $manifest_path ) ) );
		}

		/**
		 * Filter manifest data
		 *
		 * @param array  $manifest      Manifest data.
		 * @param string $assets_path  Manifest directory path.
		 * @param string $manifest_path Manifest file path.
		 * @param bool   $is_dev        Whether this is a manifest for development assets.
		 */
		$manifest = apply_filters( strtolower( __CLASS__ ) . '__manifest_data', $manifest, $this->assets_path, $manifest_path );

		self::$manifests[ $manifest_path ] = (object) [
			'data'   => $manifest,
			'dir'    => $this->assets_path,
			'is_dev' => $is_dev,
		];

		return self::$manifests[ $manifest_path ];
	}

	/**
	 * Get client dev script handle
	 *
	 * @param object|null $manifest Manifest object.
	 *
	 * @return string
	 */
	protected function get_dev_client_handle( object $manifest = null ) {

		$manifest = $manifest ?? $this->get_manifest();

		$port = $manifest->is_dev ? $manifest->data->port : null;

		// Add port to the handle to allow multiple dev servers to run at the same time.
		return $port ? self::DEV_CLIENT_HANDLE . "-{$port}" : self::DEV_CLIENT_HANDLE;
	}

	/**
	 * Filter script tag
	 *
	 * This creates a function to be used as callback for the `script_loader` filter
	 * which adds `type="module"` attribute to the script tag.
	 *
	 * @param string $handle Script handle.
	 *
	 * @return void
	 */
	private function filter_script_tag( string $handle ): void {
		add_filter( 'script_loader_tag', fn ( ...$args ) => $this->set_script_type_attribute( $handle, ...$args ), 10, 3 );
	}

	/**
	 * Add `type="module"` to a script tag
	 *
	 * @param string $target_handle Handle of the script being targeted by the filter callback.
	 * @param string $tag           Original script tag.
	 * @param string $handle        Handle of the script that's currently being filtered.
	 * @param string $src           Script source.
	 *
	 * @return string Script tag with attribute `type="module"` added.
	 */
	public function set_script_type_attribute( string $target_handle, string $tag, string $handle, string $src ): string {
		if ( $target_handle !== $handle ) {
			return $tag;
		}

		$processor = new WP_HTML_Tag_Processor( $tag );

		$script_fount = false;

		do {
			$script_fount = $processor->next_tag( 'script' );
		} while ( $processor->get_attribute( 'src' ) !== $src );

		if ( $script_fount ) {
			$processor->set_attribute( 'type', 'module' );
		}

		return $processor->get_updated_html();
	}

	/**
	 * Generate development asset src
	 *
	 * @param object $manifest Asset manifest.
	 * @param string $entry    Asset entry name.
	 *
	 * @return string
	 */
	protected function generate_development_asset_src( object $manifest, string $entry ): string {
		return sprintf(
			'%s/%s',
			untrailingslashit( $manifest->data->origin ),
			trim( preg_replace( '/[\/]{2,}/', '/', "{$manifest->data->base}/{$entry}" ), '/' )
		);
	}

	/**
	 * Register vite client script
	 *
	 * @param object $manifest Asset manifest.
	 *
	 * @return void
	 */
	protected function register_dev_client_script( object $manifest ): void {
		$handle = $this->get_dev_client_handle( $manifest );

		if ( wp_script_is( $handle, 'enqueued' ) ) {
			return;
		}

		$src = $this->generate_development_asset_src( $manifest, '@vite/client' );

		wp_register_script( $handle, $src, [], null, false );

		$this->filter_script_tag( $handle );
	}

	/**
	 * Inject react-refresh preamble script once, if needed
	 *
	 * @param object $manifest Asset manifest.
	 * @return void
	 */
	protected function inject_react_refresh_preamble_script( object $manifest ): void {

		$port = $manifest->is_dev ? $manifest->data->port : null;

		if ( ! $port || ! empty( self::$preamble_printed_ports[ $manifest->data->port ] ) ) {
			return;
		}

		self::$preamble_printed_ports[ $manifest->data->port ] = true;

		if ( ! in_array( 'vite:react-refresh', $manifest->data->plugins, true ) ) {
			return;
		}

		$react_refresh_script_src = $this->generate_development_asset_src( $manifest, '@react-refresh' );
		$script_position          = 'after';
		$script                   = <<<OUTPUT
import RefreshRuntime from "{$react_refresh_script_src}";
RefreshRuntime.injectIntoGlobalHook(window);
window.\$RefreshReg$ = () => {};
window.\$RefreshSig$ = () => (type) => type;
window.__vite_plugin_react_preamble_installed__ = true;
OUTPUT;

		$handle = $this->get_dev_client_handle( $manifest );

		wp_add_inline_script( $handle, $script, $script_position );
		add_filter(
			'wp_inline_script_attributes',
			function ( array $attributes ) use ( $script_position, $handle ): array {
				if ( isset( $attributes['id'] ) && $handle . "-js-{$script_position}" === $attributes['id'] ) {
					$attributes['type'] = 'module';
				}

				return $attributes;
			}
		);
	}

	/**
	 * Load development asset
	 *
	 * @param object $manifest Asset manifest.
	 * @param string $entry    Entrypoint to enqueue.
	 * @param array  $options  Enqueue options.
	 *
	 * @return array|null Array containing registered scripts or NULL if the none was registered.
	 */
	protected function load_development_asset( object $manifest, string $entry, array $options ): ?array {
		$this->register_dev_client_script( $manifest );
		$this->inject_react_refresh_preamble_script( $manifest );

		$dependencies = array_merge(
			[ $this->get_dev_client_handle( $manifest ) ],
			$options['dependencies']
		);

		$src = $this->generate_development_asset_src( $manifest, $entry );

		$this->filter_script_tag( $options['handle'] );

		// This is a development script, browsers shouldn't cache it.
		if ( ! wp_register_script( $options['handle'], $src, $dependencies, null, $options['in-footer'] ) ) {
			return null;
		}

		$assets = [
			'scripts' => [ $options['handle'] ],
			'styles'  => $options['css-dependencies'],
		];

		/**
		 * Filter registered development assets
		 *
		 * @param array  $assets   Registered assets.
		 * @param object $manifest Manifest object.
		 * @param string $entry    Entrypoint file.
		 * @param array  $options  Enqueue options.
		 */
		$assets = apply_filters( strtolower( __CLASS__ ) . '__development_assets', $assets, $manifest, $entry, $options );

		return $assets;
	}

	/**
	 * Load production asset
	 *
	 * @param object $manifest Asset manifest.
	 * @param string $entry    Entrypoint to enqueue.
	 * @param array  $options  Enqueue options.
	 *
	 * @return array|null Array containing registered scripts & styles or NULL if there was an error.
	 */
	protected function load_production_asset( object $manifest, string $entry, array $options ): ?array {
		if ( ! isset( $manifest->data->{$entry} ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				wp_die( esc_html( sprintf( '[ViteAssets] Entry %s not found.', $entry ) ) );
			}

			return null;
		}

		$assets = [
			'scripts' => [],
			'styles'  => [],
		];
		$item   = $manifest->data->{$entry};
		$src    = "{$this->assets_url}/{$item->file}";

		if ( ! $options['css-only'] ) {
			$this->filter_script_tag( $options['handle'] );

			// Don't worry about browser caching as the version is embedded in the file name.
			if ( wp_register_script( $options['handle'], $src, $options['dependencies'], null, $options['in-footer'] ) ) {
				$assets['scripts'][] = $options['handle'];
			}
		}

		if ( ! empty( $item->css ) ) {
			foreach ( $item->css as $index => $css_file_path ) {
				$style_handle = "{$options['handle']}-{$index}";

				// Don't worry about browser caching as the version is embedded in the file name.
				if ( wp_register_style( $style_handle, "{$this->assets_url}/{$css_file_path}", $options['css-dependencies'], null, $options['css-media'] ) ) {
					$assets['styles'][] = $style_handle;
				}
			}
		}

		/**
		 * Filter registered production assets
		 *
		 * @param array  $assets   Registered assets.
		 * @param object $manifest Manifest object.
		 * @param string $entry    Entrypoint file.
		 * @param array  $options  Enqueue options.
		 */
		$assets = apply_filters( strtolower( __CLASS__ ) . '__production_assets', $assets, $manifest, $entry, $options );

		return $assets;
	}

	/**
	 * Parse register/enqueue options
	 *
	 * @param array $options Array of options.
	 *
	 * @return array Array of options merged with defaults.
	 */
	protected static function parse_options( array $options ): array {
		$defaults = [
			'css-dependencies' => [],
			'css-media'        => 'all',
			'css-only'         => false,
			'dependencies'     => [],
			'handle'           => '',
			'in-footer'        => false,
		];

		return wp_parse_args( $options, $defaults );
	}

	/**
	 * Register asset
	 *
	 * @see load_development_asset
	 * @see load_production_asset
	 *
	 * @param string $entry        Entrypoint to enqueue.
	 * @param array  $options      Enqueue options.
	 *
	 * @return array
	 */
	public function register_asset( string $entry, array $options ): ?array {
		try {
			$manifest = $this->get_manifest();
		} catch ( Exception $e ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
				wp_die( esc_html( $e->getMessage() ) );
			}

			return null;
		}

		$options = $this->parse_options( $options );
		$assets  = $manifest->is_dev
		? $this->load_development_asset( $manifest, $entry, $options )
		: $this->load_production_asset( $manifest, $entry, $options );

		$this->registered_assets[ $entry ] = $assets;

		return $assets;
	}

	/**
	 * Enqueue asset
	 *
	 * @see register_asset
	 *
	 * @param string $entry        Entrypoint to enqueue.
	 * @param array  $options      Enqueue options.
	 *
	 * @return bool
	 */
	public function enqueue_asset( string $entry, array $options ): bool {
		$assets = $this->register_asset( $entry, $options );

		if ( is_null( $assets ) ) {
			return false;
		}

		$map = [
			'scripts' => 'wp_enqueue_script',
			'styles'  => 'wp_enqueue_style',
		];

		foreach ( $assets as $group => $handles ) {
			$func = $map[ $group ];

			foreach ( $handles as $handle ) {
				$func( $handle );
			}
		}

		return true;
	}
}
