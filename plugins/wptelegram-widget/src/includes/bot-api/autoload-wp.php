<?php
/**
 * The main plugin file.
 *
 * @link              https://wpsocio.com
 * @since             1.2.7
 * @package           WPTelegram\BotAPI
 *
 * @wordpress-plugin
 * Plugin Name:       WP Telegram Bot API
 * Plugin URI:        https://github.com/wpsocio/wptelegram-bot-api
 * Description:       ❌ DO NOT DELETE ❌ WP Loader for WP Telegram Bot API library.
 * Version:           999.999.999
 * Author:            WP Socio
 * Author URI:        https://github.com/wpsocio
 * License:           GPL-3.0+
 * License URI:       http://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain:       wptelegram
 * Domain Path:       /languages
 */

// Namespace doesn't really matter here.
namespace WPTelegram\BotAPI;

use WPTelegram\BotAPI\restApi\RESTAPIController;

// If this file is called directly, abort.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

if ( ! class_exists( __NAMESPACE__ . '\WPLoader_1_2_7', false ) ) {
	/**
	 * Handles checking for and loading the newest version of the library
	 *
	 * Inspired from CMB2 loading technique
	 * to ensure that only the latest version is loaded
	 *
	 * @see https://github.com/CMB2/CMB2/blob/v2.3.0/init.php
	 *
	 * @since  1.2.7
	 *
	 * @category  WordPress_Plugin Addon
	 * @package   WPTelegram\BotAPI
	 * @author    WPTelegram team
	 * @license   GPL-3.0+
	 * @link      https://t.me/WPTelegram
	 */
	class WPLoader_1_2_7 {

		/**
		 * Current version number
		 *
		 * @var   string
		 * @since 1.2.7
		 */
		const VERSION = '1.2.7';

		/**
		 * Current version hook priority.
		 * Will decrement with each release
		 *
		 * @var   int
		 * @since 1.2.7
		 */
		const PRIORITY = 9978;

		/**
		 * Single instance of the WPLoader_1_2_7 object
		 *
		 * @var WPLoader_1_2_7
		 */
		private static $instance = null;

		/**
		 * Creates/returns the single instance WPLoader_1_2_7 object
		 *
		 * @since  1.2.7
		 * @return WPLoader_1_2_7 Single instance object
		 */
		public static function initiate() {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}
			return self::$instance;
		}

		/**
		 * Starts the version checking process.
		 * Creates WPTELEGRAM_BOT_API_LOADED definition for early detection by other scripts
		 *
		 * Hooks the library inclusion to the after_setup_theme hook on a high priority which decrements
		 * (increasing the priority) with each version release.
		 *
		 * @since 1.2.7
		 */
		private function __construct() {
			/**
			 * Use after_setup_theme hook instead of init
			 * to make the library available during init
			 */
			add_action( 'after_setup_theme', [ $this, 'init' ], self::PRIORITY );
		}

		/**
		 * A final check if the library is already loaded before kicking off our loading.
		 * WPTELEGRAM_BOT_API_VERSION constant is set at this point.
		 *
		 * @since  1.2.7
		 */
		public function init() {
			if ( defined( 'WPTELEGRAM_BOT_API_LOADED' ) ) {
				return;
			}

			/**
			 * A constant you can use to check if the library is loaded
			 */
			define( 'WPTELEGRAM_BOT_API_LOADED', self::PRIORITY );

			if ( ! defined( 'WPTELEGRAM_BOT_API_VERSION' ) ) {
				define( 'WPTELEGRAM_BOT_API_VERSION', self::VERSION );
			}

			if ( ! defined( 'WPTELEGRAM_BOT_API_DIR' ) ) {
				define( 'WPTELEGRAM_BOT_API_DIR', dirname( __FILE__ ) );
			}

			// Now kick off the class autoloader.
			spl_autoload_register( [ __CLASS__, 'autoload_classes' ] );

			add_action( 'rest_api_init', [ RESTAPIController::class, 'init' ] );
		}

		/**
		 * Autoloads files with WPTelegram\BotAPI classes when needed
		 *
		 * @since  1.2.7
		 * @param  string $class_name Name of the class being requested.
		 */
		public static function autoload_classes( $class_name ) {
			$namespace = 'WPTelegram\BotAPI';

			if ( 0 !== strpos( $class_name, $namespace ) ) {
				return;
			}

			$class_name = str_replace( $namespace, '', $class_name );
			$class_name = str_replace( '\\', DIRECTORY_SEPARATOR, $class_name );

			$path = WPTELEGRAM_BOT_API_DIR . DIRECTORY_SEPARATOR . 'src' . $class_name . '.php';

			include_once $path;
		}
	}
	WPLoader_1_2_7::initiate();
}
