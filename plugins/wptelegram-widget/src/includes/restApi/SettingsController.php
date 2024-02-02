<?php
/**
 * Plugin settings endpoint for WordPress REST API.
 *
 * @link       https://wpsocio.com
 * @since      1.7.0
 *
 * @package    WPTelegram_Widget
 * @subpackage WPTelegram_Widget/includes
 */

namespace WPTelegram\Widget\includes\restApi;

use WPTelegram\Widget\includes\Utils;
use WPTelegram\BotAPI\API;
use WP_REST_Request;
use WP_REST_Server;

/**
 * Class to handle the settings endpoint.
 *
 * @since 1.7.0
 *
 * @package    WPTelegram_Widget
 * @subpackage WPTelegram_Widget/includes
 * @author     WP Socio
 */
class SettingsController extends RESTController {

	/**
	 * Pattern to match Telegram username.
	 *
	 * @var string Pattern.
	 * @since x.y.x
	 */
	const TG_USERNAME_PATTERN = '[a-zA-Z][a-zA-Z0-9_]{3,30}[a-zA-Z0-9]';

	/**
	 * The base of this controller's route.
	 *
	 * @var string
	 */
	const REST_BASE = '/settings';

	/**
	 * The plugin settings/options.
	 *
	 * @var string
	 */
	protected $settings;

	/**
	 * Constructor
	 *
	 * @since 1.7.0
	 */
	public function __construct() {
		$this->settings = WPTG_Widget()->options();
	}

	/**
	 * Register the routes for the objects of the controller.
	 *
	 * @since 1.7.0
	 */
	public function register_routes() {

		register_rest_route(
			self::REST_NAMESPACE,
			self::REST_BASE,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_settings' ],
					'permission_callback' => [ $this, 'settings_permissions' ],
					'args'                => self::get_settings_params( 'view' ),
				],
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'update_settings' ],
					'permission_callback' => [ $this, 'settings_permissions' ],
					'args'                => self::get_settings_params( 'edit' ),
				],
			]
		);
	}

	/**
	 * Check request permissions.
	 *
	 * @since 1.7.0
	 *
	 * @return bool
	 */
	public function settings_permissions() {
		return current_user_can( 'manage_options' );
	}

	/**
	 * Get the default settings.
	 *
	 * @return array
	 */
	public static function get_default_settings() {

		$settings = WPTG_Widget()->options()->get_data();

		// If we have something saved.
		if ( ! isset( $settings['ajax_widget'] ) ) {
			return self::get_default_values();
		}

		unset( $settings['messages'] );
		unset( $settings['last_update_id'] );

		return $settings;
	}

	/**
	 * Get the default values for settings.
	 *
	 * @return array
	 */
	public static function get_default_values() {
		return [
			'ajax_widget'   => [
				'username' => '',
				'width'    => '100%',
				'height'   => '600px',
			],
			'legacy_widget' => [
				'username'     => '',
				'width'        => '100%',
				'height'       => '600px',
				'bot_token'    => '',
				'author_photo' => 'auto',
				'num_messages' => '5',
			],
			'join_link'     => [
				'url'             => '',
				'text'            => '',
				'bgcolor'         => '#389ce9',
				'text_color'      => '#fff',
				'post_types'      => [ 'post' ],
				'position'        => 'after_content',
				'priority'        => '10',
				'open_in_new_tab' => false,
			],
			'advanced'      => [
				'telegram_blocked'  => false,
				'google_script_url' => '',
			],
		];
	}

	/**
	 * Get settings via API.
	 *
	 * @since 1.7.0
	 */
	public function get_settings() {
		return rest_ensure_response( self::get_default_settings() );
	}

	/**
	 * Update settings.
	 *
	 * @since 1.7.0
	 *
	 * @param WP_REST_Request $request WP REST API request.
	 */
	public function update_settings( WP_REST_Request $request ) {
		$params = array_keys( self::get_default_values() );

		$settings = WPTG_Widget()->options()->get_data();

		foreach ( $params as $key ) {
			$settings[ $key ] = $request->get_param( $key );
		}

		WPTG_Widget()->options()->set_data( $settings )->update_data();

		unset( $settings['messages'], $settings['last_update_id'] );

		return rest_ensure_response( $settings );
	}

	/**
	 * Retrieves the query params for the settings.
	 *
	 * @since 1.7.0
	 *
	 * @param string $context The context for the values.
	 * @return array Query parameters for the settings.
	 */
	public static function get_settings_params( $context = 'edit' ) {
		$ajax_widget_props = [
			'username' => [
				'type'    => 'string',
				'pattern' => Utils::enhance_regex( self::TG_USERNAME_PATTERN, true ),
			],
			'width'    => [
				'type' => 'string',
			],
			'height'   => [
				'type' => 'string',
			],
		];

		return [
			'ajax_widget'   => [
				'type'              => 'object',
				'properties'        => $ajax_widget_props,
				'sanitize_callback' => [ __CLASS__, 'sanitize_param' ],
				'validate_callback' => 'rest_validate_request_arg',
			],
			'legacy_widget' => [
				'type'              => 'object',
				'sanitize_callback' => [ __CLASS__, 'sanitize_param' ],
				'validate_callback' => 'rest_validate_request_arg',
				'properties'        => array_merge(
					$ajax_widget_props,
					[
						'bot_token'    => [
							'type'    => 'string',
							'pattern' => Utils::enhance_regex( API::BOT_TOKEN_PATTERN, true ),
						],
						'author_photo' => [
							'type' => 'string',
							'enum' => [ 'auto', 'always_show', 'always_hide' ],
						],
						'num_messages' => [
							'type' => 'string',
						],
					]
				),
			],
			'join_link'     => [
				'type'              => 'object',
				'sanitize_callback' => [ __CLASS__, 'sanitize_param' ],
				'validate_callback' => 'rest_validate_request_arg',
				'properties'        => [
					'url'             => [
						'type'   => 'string',
						'format' => 'uri',
					],
					'text'            => [
						'type' => 'string',
					],
					'bgcolor'         => [
						'type' => 'string',
					],
					'text_color'      => [
						'type' => 'string',
					],
					'post_types'      => [
						'type'  => 'array',
						'items' => [
							'type' => 'string',
						],
					],
					'position'        => [
						'type' => 'string',
						'enum' => [ 'before_content', 'after_content' ],
					],
					'priority'        => [
						'type' => 'string',
					],
					'open_in_new_tab' => [
						'type' => 'boolean',
					],
				],
			],
			'advanced'      => [
				'type'              => 'object',
				'sanitize_callback' => [ __CLASS__, 'sanitize_param' ],
				'validate_callback' => 'rest_validate_request_arg',
				'properties'        => [
					'telegram_blocked'  => [
						'type' => 'boolean',
					],
					'google_script_url' => [
						'type'   => 'string',
						'format' => 'uri',
					],
				],
			],
		];
	}

	/**
	 * Sanitize the request param.
	 *
	 * @since 2.0.2
	 *
	 * @param mixed           $value   Value of the param.
	 * @param WP_REST_Request $request WP REST API request.
	 * @param string          $param     The param key.
	 */
	public static function sanitize_param( $value, WP_REST_Request $request, $param ) {
		// Lets make the value safer.
		return Utils::sanitize( $value );
	}
}
