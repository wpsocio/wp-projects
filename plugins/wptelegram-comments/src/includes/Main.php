<?php
/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://wpsocio.com
 * @since      1.0.0
 *
 * @package    WPTelegram\Comments
 * @subpackage WPTelegram\Comments\includes
 */

namespace WPTelegram\Comments\includes;

use WPTelegram\Comments\admin\Admin;
use WPTelegram\Comments\shared\Shared;
use WPSocio\WPUtils\IframedWPAdmin;
use WPSocio\WPUtils\ViteWPReactAssets as Assets;
use WPSocio\WPUtils\Options;

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    WPTelegram\Comments
 * @subpackage WPTelegram\Comments\includes
 * @author     WP Socio
 */
class Main {

	/**
	 * Whether the dependencies have been initiated.
	 *
	 * @since 1.1.10
	 * @var   bool $initiated Whether the dependencies have been initiated.
	 */
	private static $initiated = false;

	/**
	 * The single instance of the class.
	 *
	 * @since 1.0.0
	 * @var   Main|null $instance The instance.
	 */
	protected static $instance = null;

	/**
	 * Title of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $title    Title of the plugin
	 */
	protected $title;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * The plugin options
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Options    $options    The plugin options.
	 */
	protected $options;

	/**
	 * The assets handler.
	 *
	 * @since    1.1.0
	 * @access   protected
	 * @var      Assets $assets The assets handler.
	 */
	protected $assets;

	/**
	 * The assets handler.
	 *
	 * @since    x.y.z
	 * @access   protected
	 * @var      IframedWPAdmin $iframed_wp_admin The iframed WP admin handler.
	 */
	protected $iframed_wp_admin;

	/**
	 * The asset manager.
	 *
	 * @since    1.1.3
	 * @access   protected
	 * @var      AssetManager $asset_manager The asset manager.
	 */
	protected $asset_manager;

	/**
	 * Main class Instance.
	 *
	 * Ensures only one instance of the class is loaded or can be loaded.
	 *
	 * @since 1.0.0
	 *
	 * @return Main instance.
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Cloning is forbidden.
	 *
	 * @since 1.0.0
	 */
	public function __clone() {}

	/**
	 * Unserializing instances of this class is forbidden.
	 *
	 * @since 1.0.0
	 */
	public function __wakeup() {}

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {

		$this->version = WPTELEGRAM_COMMENTS_VER;

		$this->plugin_name = 'wptelegram_comments';

		$this->load_dependencies();

		$this->set_locale();
	}

	/**
	 * Registers the initial hooks.
	 *
	 * @since   1.1.10
	 * @access   private
	 */
	public function init() {
		if ( self::$initiated ) {
			return;
		}
		self::$initiated = true;

		// Then lets hook everything up.
		add_action( 'plugins_loaded', [ $this, 'hookup' ], 20 );
	}

	/**
	 * Registers the initial hooks.
	 *
	 * @since    1.1.10
	 * @access   public
	 */
	public function hookup() {
		$this->define_admin_hooks();
		$this->define_shared_hooks();
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * @since    1.1.10
	 * @access   private
	 */
	private function load_dependencies() {
	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the I18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new I18n();

		add_action( 'init', [ $plugin_i18n, 'load_plugin_textdomain' ] );
	}

	/**
	 * Set the plugin options
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_options() {

		$this->options = new Options( $this->name() );
	}

	/**
	 * Get the plugin options
	 *
	 * @since    1.0.0
	 * @access   public
	 *
	 * @return Options
	 */
	public function options() {
		if ( ! $this->options ) {
			$this->set_options();
		}
		return $this->options;
	}

	/**
	 * Set the assets handler.
	 *
	 * @since    1.1.0
	 * @access   private
	 */
	private function set_assets() {
		$this->assets = new Assets(
			$this->dir( '/assets/build' ),
			$this->url( '/assets/build' )
		);
	}

	/**
	 * Get the plugin assets handler.
	 *
	 * @since    1.1.0
	 * @access   public
	 *
	 * @return Assets The assets instance.
	 */
	public function assets() {
		if ( ! $this->assets ) {
			$this->set_assets();
		}

		return $this->assets;
	}

	/**
	 * Get the iframed WP admin handler.
	 *
	 * @since x.y.z
	 * @access   public
	 *
	 * @return IframedWPAdmin The iframed WP admin instance.
	 */
	public function iframed_wp_admin() {
		if ( ! $this->iframed_wp_admin ) {
			$this->iframed_wp_admin = new IframedWPAdmin(
				// Since the vendor directory can be one level up in dev mode, we need to account for that.
				dirname( WPTELEGRAM_COMMENTS_MAIN_FILE ) . '/vendor/wpsocio/wp-utils',
				plugins_url( 'vendor/wpsocio/wp-utils', WPTELEGRAM_COMMENTS_MAIN_FILE )
			);
		}

		return $this->iframed_wp_admin;
	}

	/**
	 * Set the asset manager.
	 *
	 * @since    1.1.3
	 * @access   private
	 */
	private function set_asset_manager() {
		$this->asset_manager = AssetManager::instance();
	}

	/**
	 * Get the plugin assets manager.
	 *
	 * @since    1.1.3
	 * @access   public
	 *
	 * @return AssetManager The asset manager.
	 */
	public function asset_manager() {
		if ( ! $this->asset_manager ) {
			$this->set_asset_manager();
		}

		return $this->asset_manager;
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = Admin::instance();

		add_action( 'admin_menu', [ $plugin_admin, 'add_plugin_admin_menu' ] );
		add_action( 'admin_menu', [ Utils::class, 'update_menu_structure' ], 5 );

		add_action( 'rest_api_init', [ $plugin_admin, 'register_rest_routes' ] );
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_shared_hooks() {

		$shared = Shared::instance();

		add_filter( 'comments_template', [ $shared, 'set_comments_template' ], PHP_INT_MAX - 100 );
		add_filter( 'render_block_core/comments', [ $shared, 'render_comments' ], 11, 1 );

		add_filter( 'wptelegram_comments_widget_attributes', [ $shared, 'set_widget_attributes' ], 10, 2 );

		$asset_manager = $this->asset_manager();

		add_action( 'init', [ $asset_manager, 'register_assets' ], 5 );

		add_action( 'admin_enqueue_scripts', [ $asset_manager, 'enqueue_admin_assets' ], 10, 1 );

		add_action( 'wpsocio_iframed_wp_admin_enqueue_assets', [ $asset_manager, 'enqueue_iframed_assets' ], 10, 1 );
	}

	/**
	 * The title of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The title of the plugin.
	 */
	public function title() {
		// Set here instead of constructor
		// to be able to translate it.
		if ( ! $this->title ) {
			$this->title = __( 'WP Telegram Comments', 'wptelegram-comments' );
		}
		return $this->title;
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function name() {
		return $this->plugin_name;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function version() {
		return $this->version;
	}

	/**
	 * Retrieve directory path to the plugin.
	 *
	 * @since 1.0.0
	 * @param string $path Path to append.
	 * @return string Directory with optional path appended
	 */
	public function dir( $path = '' ) {
		return WPTELEGRAM_COMMENTS_DIR . $path;
	}

	/**
	 * Retrieve URL path to the plugin.
	 *
	 * @since 1.0.0
	 * @param string $path Path to append.
	 * @return string URL with optional path appended
	 */
	public function url( $path = '' ) {
		return WPTELEGRAM_COMMENTS_URL . $path;
	}

	/**
	 * Get the asset path.
	 *
	 * @param string $path Path to append.
	 * @return string
	 */
	public function asset_path( $path = '' ) {
		return $this->dir( '/assets' . $path );
	}

	/**
	 * Get the asset URL.
	 *
	 * @param string $path Path to append.
	 * @return string
	 */
	public function asset_url( $path = '' ) {
		return $this->url( '/assets' . $path );
	}
}
