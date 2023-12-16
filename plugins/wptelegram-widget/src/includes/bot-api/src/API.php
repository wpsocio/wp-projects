<?php
/**
 * Main class.
 *
 * @link       https://wpsocio.com
 * @since      1.0.0
 *
 * @package    WPTelegram\BotAPI
 * @subpackage WPTelegram\BotAPI
 */

namespace WPTelegram\BotAPI;

use WP_Error;

if ( ! class_exists( __NAMESPACE__ . '\API', false ) ) :
	/**
	 * Main class.
	 *
	 * @since  1.0.1
	 *
	 * @category  WordPress_Plugin Addon
	 * @package   WPTelegram\BotAPI
	 * @author    WPTelegram team
	 * @license   GPL-2.0+
	 * @link      https://t.me/WPTelegram
	 */
	class API {

		/**
		 * Pattern to match Telegram bot token.
		 *
		 * @var string Pattern.
		 * @since 1.2.3
		 */
		const BOT_TOKEN_PATTERN = '[0-9]{9,11}:[\w-]{35}';

		/**
		 * Regular expression to match Telegram bot token.
		 *
		 * @var string Regex.
		 * @since 1.2.2
		 */
		const BOT_TOKEN_REGEX = '/\A' . self::BOT_TOKEN_PATTERN . '\Z/i';

		/**
		 * All the instances of the API object
		 *
		 * @var API
		 */
		public static $instances;

		/**
		 * Telegram Bot API Access Token.
		 *
		 * @var string
		 */
		private $bot_token;

		/**
		 * The Telegram client
		 *
		 * @var Client
		 */
		protected $client;

		/**
		 * The original request
		 *
		 * @var Request
		 */
		protected $request;

		/**
		 * Stores the last request made to Telegram Bot API.
		 *
		 * @var Response|null
		 */
		protected $last_response;

		/**
		 * Instantiates a new WPTelegram\BotAPI object.
		 *
		 * @param string $bot_token   The Telegram Bot API Access Token.
		 */
		public function __construct( $bot_token = null ) {
			$this->bot_token = $bot_token;

			$this->client = new Client();
		}

		/**
		 * Creates/returns the single instance API object for the specific plugin
		 * to avoid multiple instances for that plugin.
		 *
		 * @since 1.0.0
		 *
		 * @param string $id   The ID of the instance, usually the plugin slug.
		 * @param string $bot_token   The Telegram Bot API Access Token.
		 *
		 * @return API Single instance object
		 */
		public static function get_instance( $id = '', $bot_token = null ) {
			if ( ! isset( self::$instances[ $id ] ) ) {
				self::$instances[ $id ] = new self( $bot_token );
			}
			return self::$instances[ $id ];
		}

		/**
		 * Magic Method to handle all API calls.
		 *
		 * @param string $method Telegram API method name.
		 * @param array  $args The method args.
		 *
		 * @return mixed|string
		 */
		public function __call( $method, $args ) {
			if ( ! empty( $args ) ) {
				$args = $args[0];
			}
			return $this->sendRequest( $method, $args );
		}

		/**
		 * Set the bot token for this request.
		 *
		 * @since  1.0.0
		 *
		 * @param string $bot_token  The Telegram Bot API Access Token.
		 */
		public function set_bot_token( $bot_token ) {
			$this->bot_token = $bot_token;
		}

		/**
		 * Returns Telegram Bot API Access Token.
		 *
		 * @return string
		 */
		public function get_bot_token() {
			return $this->bot_token;
		}

		/**
		 * Returns Telegram Bot API Client instance.
		 *
		 * @return Client
		 */
		public function get_client() {
			return $this->client;
		}

		/**
		 * Return the original request.
		 *
		 * @since   1.0.0
		 *
		 * @return Request
		 */
		public function get_request() {
			return $this->request;
		}

		/**
		 * Returns the last response returned from API request.
		 *
		 * @return Response|WP_Error
		 */
		public function get_last_response() {
			return $this->last_response;
		}

		/**
		 * Send Text Message.
		 *
		 * @since  1.0.0
		 *
		 * @param array $params The message args.
		 * @return Response
		 */
		//phpcs:ignore -- snake case
		public function sendMessage( $params ) {

			if ( mb_strlen( $params['text'], 'UTF-8' ) > 4096 ) {
				// break text after every 4096th character and preserve words.
				preg_match_all( '/.{1,4095}(?:\s|$)/su', $params['text'], $matches );
				foreach ( $matches[0] as $text ) {
					$params['text']                = $text;
					$res                           = $this->sendRequest( __FUNCTION__, $params );
					$params['reply_to_message_id'] = null;
				}
				return $res;
			}
			return $this->sendRequest( __FUNCTION__, $params );
		}

		/**
		 * Send API request.
		 *
		 * @since  1.0.0
		 *
		 * @param string $api_method The method name.
		 * @param array  $params The message args.
		 * @return Response
		 */
		//phpcs:ignore -- snake case
		private function sendRequest( $api_method, $params ) {

			if ( ! $this->get_bot_token() ) {
				return new WP_Error( 'invalid_bot_token', 'Bot Token is required to make a request' );
			}

			if ( isset( $params['chat_id'] ) ) {
				// Make the chat_id as string to avoid long int issues.
				$params['chat_id'] = (string) $params['chat_id'];
			}

			// Can be used for proxy.
			do_action( 'wptelegram_bot_api_remote_request_init' );

			$this->request = $this->request( $api_method, $params );

			do_action( 'wptelegram_bot_api_before_request', $this->get_request(), $this->last_response );

			$this->last_response = $this->get_client()->sendRequest( $this->get_request() );

			do_action( 'wptelegram_bot_api_after_request', $this->get_request(), $this->last_response );

			do_action( 'wptelegram_bot_api_debug', $this->last_response, $this );

			// Can be used for proxy.
			do_action( 'wptelegram_bot_api_remote_request_finish' );

			return $this->last_response;
		}

		/**
		 * Check if the response is successful
		 *
		 * @param Response $res The API response.
		 * @return bool
		 */
		public function is_success( $res = null ) {

			if ( is_null( $res ) ) {
				$res = $this->last_response;
			}

			if ( ! is_wp_error( $res ) && $res instanceof Response && 200 === $res->get_response_code() ) {
				return true;
			}
			return false;
		}

		/**
		 * Instantiates a new Request
		 *
		 * @param string $api_method The method name.
		 * @param array  $params The message args.
		 * @return Request
		 */
		private function request( $api_method, array $params = [] ) {
			return new Request(
				$this->get_bot_token(),
				$api_method,
				$params
			);
		}
	}
endif;
