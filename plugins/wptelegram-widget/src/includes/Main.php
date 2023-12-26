<?php
/**
 * The file that defines the core plugin class
 *
 * @link       https://wpsocio.com
 * @since      1.0.0
 *
 * @package    WPTelegram_Widget
 * @subpackage WPTelegram_Widget/includes
 */

namespace WPTelegram\Widget\includes;

use WPSocio\WPUtils\ViteAssets as Assets;
use WPTelegram\Widget\admin\Admin;
use WPTelegram\Widget\shared\Shared;
use WPTelegram\Widget\shared\embed\AjaxWidget as EmbedAjaxWidget;
use WPTelegram\Widget\shared\embed\SingleMessage as EmbedSingleMessage;
use WPTelegram\Widget\shared\shortcodes\AjaxWidget as AjaxWidgetShortcode;
use WPTelegram\Widget\shared\shortcodes\JoinChannel as JoinChannelShortcode;
use WPTelegram\Widget\shared\shortcodes\LegacyWidget as LegacyWidgetShortcode;
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
 * @package    WPTelegram_Widget
 * @subpackage WPTelegram_Widget/includes
 * @author     WP Socio
 */
class Main {

	/**
	 * The single instance of the class.
	 *
	 * @since 1.0.0
	 * @var   Main $instance The instance.
	 */
	protected static $instance = null;

	/**
	 * Whether the dependencies have been initiated.
	 *
	 * @since 2.1.9
	 * @var   bool $initiated Whether the dependencies have been initiated.
	 */
	private static $initiated = false;

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
	 * @var      Options    $options    The plugin options
	 */
	protected $options;

	/**
	 * The assets handler.
	 *
	 * @since    2.0.0
	 * @access   protected
	 * @var      string    $assets    The assets handler.
	 */
	protected $assets;

	/**
	 * The asset manager.
	 *
	 * @since    2.1.0
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
	private function __construct() {

		$this->version = WPTELEGRAM_WIDGET_VER;

		$this->plugin_name = 'wptelegram_widget';

		$this->load_dependencies();

		$this->set_locale();
	}

	/**
	 * Registers the initial hooks.
	 *
	 * @since   2.1.0
	 * @access   private
	 */
	public function init() {
		if ( self::$initiated ) {
			return;
		}
		self::$initiated = true;

		$plugin_upgrade = new Upgrade( $this );

		// First lets do the upgrades, if needed.
		add_action( 'plugins_loaded', [ $plugin_upgrade, 'do_upgrade' ], 10 );

		// Then lets hook everything up.
		add_action( 'plugins_loaded', [ $this, 'hookup' ], 20 );
	}

	/**
	 * Registers the initial hooks.
	 *
	 * @since    2.1.0
	 * @access   public
	 */
	public function hookup() {
		// If an upgrade is going on.
		if ( defined( 'WPTELEGRAM_WIDGET_DOING_UPGRADE' ) && WPTELEGRAM_WIDGET_DOING_UPGRADE ) {
			return;
		}
		$this->define_admin_hooks();
		$this->define_shared_hooks();
	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * Helper functions
		 */
		require_once $this->dir( '/includes/helper-functions.php' );
	}

	/**
	 * Set the plugin options
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_options() {

		$this->options = new Options( $this->plugin_name );
	}

	/**
	 * Get the plugin options
	 *
	 * @since    1.0.0
	 * @access   public
	 *
	 * @return Options The options instance.
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
	 * @since    2.0.0
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
	 * @since    2.0.0
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
	 * Set the asset manager.
	 *
	 * @since    2.1.0
	 * @access   private
	 */
	private function set_asset_manager() {
		$this->asset_manager = new AssetManager( $this );
	}

	/**
	 * Get the plugin assets manager.
	 *
	 * @since    2.1.0
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
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the WPTelegram_Widget_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new I18n();

		add_action( 'plugins_loaded', [ $plugin_i18n, 'load_plugin_textdomain' ] );
	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Admin( $this );

		add_action( 'admin_menu', [ $plugin_admin, 'add_plugin_admin_menu' ] );
		add_action( 'admin_menu', [ Utils::class, 'update_menu_structure' ], 5 );

		add_action( 'rest_api_init', [ $plugin_admin, 'register_rest_routes' ] );

		add_action( 'widgets_init', [ $plugin_admin, 'register_widgets' ] );

		// To be used for long polling.
		add_action( 'admin_post_nopriv_wptelegram_widget_pull_updates', [ $plugin_admin, 'fire_pull_updates' ] );
		add_action( 'admin_post_wptelegram_widget_pull_updates', [ $plugin_admin, 'fire_pull_updates' ] );

		add_action( 'wptelegram_widget_pull_the_updates', [ $plugin_admin, 'pull_the_updates' ] );

		// To be used for displaying the widget messages.
		add_action( 'admin_post_nopriv_wptelegram_widget_view', [ $plugin_admin, 'render_widget_view' ] );
		add_action( 'admin_post_wptelegram_widget_view', [ $plugin_admin, 'render_widget_view' ] );

		add_action( 'wptelegram_p2tg_api_response', [ $plugin_admin, 'save_messages_sent_by_p2tg' ], 10, 5 );

		add_filter( 'block_categories_all', [ $plugin_admin, 'register_block_category' ], 10, 1 );

		add_filter( 'rest_request_before_callbacks', [ Utils::class, 'fitler_rest_errors' ], 10, 3 );
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_shared_hooks() {

		$shared = new Shared( $this );

		add_action( 'init', [ $shared, 'add_rewrite_rules' ] );

		add_filter( 'init', [ $shared, 'set_use_ugly_urls' ] );

		add_filter( 'template_include', [ $shared, 'set_embed_template' ], 99 );

		add_filter( 'template_include', [ $shared, 'intercept_v_template' ], 999 );

		add_action( 'init', [ $shared, 'may_be_fire_pull_updates' ] );

		add_action( 'init', [ $shared, 'register_blocks' ] );

		add_action( 'wptelegram_widget_cron_pull_updates', [ $shared, 'cron_pull_updates' ] );

		// better be safe by using PHP_INT_MAX to make sure
		// some dumb people don't remove your schedule.
		add_filter( 'cron_schedules', [ $shared, 'custom_cron_schedules' ], PHP_INT_MAX, 1 ); //phpcs:ignore WordPress.WP.CronInterval

		$proprity = $this->options()->get_path( 'join_link.priority', 10 );

		add_filter( 'the_content', [ $shared, 'add_join_link_to_post_content' ], $proprity, 1 );

		$asset_manager = $this->asset_manager();

		// Ensure that assets are registered before any other hooks.
		add_action( 'init', [ $asset_manager, 'register_assets' ], 5 );

		add_action( 'wp_enqueue_scripts', [ $asset_manager, 'enqueue_public_styles' ] );
		add_action( 'wp_enqueue_scripts', [ $asset_manager, 'enqueue_public_scripts' ] );

		add_action( 'admin_enqueue_scripts', [ $asset_manager, 'enqueue_admin_styles' ] );
		add_action( 'admin_enqueue_scripts', [ $asset_manager, 'enqueue_admin_scripts' ] );

		add_action( 'enqueue_block_editor_assets', [ $asset_manager, 'enqueue_block_editor_assets' ] );

		add_shortcode( 'wptelegram-ajax-widget', [ AjaxWidgetShortcode::class, 'render' ] );
		add_shortcode( 'wptelegram-join-channel', [ JoinChannelShortcode::class, 'render' ] );
		add_shortcode( 'wptelegram-widget', [ LegacyWidgetShortcode::class, 'render' ] );

		// Register embeds.
		add_action( 'wptelegram_widget_ajax_widget_embed', [ EmbedAjaxWidget::class, 'render' ], 10, 1 );

		add_action( 'wptelegram_widget_single_message_embed', [ EmbedSingleMessage::class, 'render' ], 10, 2 );
	}

	/**
	 * The title of the plugin.
	 *
	 * @since     1.7.1
	 * @return    string    The title of the plugin.
	 */
	public function title() {
		// Set here instead of constructor
		// to be able to translate it.
		if ( ! $this->title ) {
			$this->title = __( 'WP Telegram Widget', 'wptelegram-widget' );
		}
		return $this->title;
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.7.1
	 * @return    string    The name of the plugin.
	 */
	public function name() {
		return $this->plugin_name;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.7.1
	 * @return    string    The version number of the plugin.
	 */
	public function version() {
		return $this->version;
	}

	/**
	 * Retrieve directory path to the plugin.
	 *
	 * @since 1.7.1
	 * @param string $path Path to append.
	 * @return string Directory with optional path appended
	 */
	public function dir( $path = '' ) {
		return WPTELEGRAM_WIDGET_DIR . $path;
	}

	/**
	 * Retrieve URL path to the plugin.
	 *
	 * @since 1.7.1
	 * @param string $path Path to append.
	 * @return string URL with optional path appended
	 */
	public function url( $path = '' ) {
		return WPTELEGRAM_WIDGET_URL . $path;
	}
}
