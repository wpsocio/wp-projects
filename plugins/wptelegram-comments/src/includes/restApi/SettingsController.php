<?php
/**
 * Plugin settings endpoint for WordPress REST API.
 *
 * @link       https://wpsocio.com
 * @since      1.0.0
 *
 * @package    WPTelegram\Comments
 * @subpackage WPTelegram\Comments\includes
 */

namespace WPTelegram\Comments\includes\restApi;

use WP_REST_Request;
use WP_REST_Server;

/**
 * Class to handle the settings endpoint.
 *
 * @since 1.0.0
 *
 * @package    WPTelegram\Comments
 * @subpackage WPTelegram\Comments\includes
 * @author     WP Socio
 */
class SettingsController extends RESTController {

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
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->settings = WPTG_Comments()->options();
	}

	/**
	 * Register the routes for the objects of the controller.
	 *
	 * @since 1.0.0
	 */
	public function register_routes() {

		register_rest_route(
			self::NAMESPACE,
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
	 * @since 1.0.0
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

		$settings = WPTG_Comments()->options()->get_data();

		// If we have somethings saved.
		if ( ! empty( $settings ) ) {
			return $settings;
		}

		// Get the default values.
		$settings = self::get_settings_params();

		foreach ( $settings as $key => $args ) {
			$settings[ $key ] = isset( $args['default'] ) ? $args['default'] : '';
		}

		return $settings;
	}

	/**
	 * Get settings via API.
	 *
	 * @since 1.0.0
	 */
	public function get_settings() {
		return rest_ensure_response( self::get_default_settings() );
	}

	/**
	 * Update settings.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_REST_Request $request WP REST API request.
	 */
	public function update_settings( WP_REST_Request $request ) {

		$settings = [];

		foreach ( self::get_settings_params() as $key => $args ) {
			$value = $request->get_param( $key );

			if ( null !== $value || isset( $args['default'] ) ) {

				$settings[ $key ] = null === $value ? $args['default'] : $value;
			}
		}

		WPTG_Comments()->options()->set_data( $settings )->update_data();

		return rest_ensure_response( $settings );
	}

	/**
	 * Retrieves the query params for the settings.
	 *
	 * @since 1.0.0
	 *
	 * @param string $context The context for the values.
	 * @return array Query parameters for the settings.
	 */
	public static function get_settings_params( $context = 'edit' ) {
		return [
			'code'       => [
				'type'              => 'string',
				'required'          => ( 'edit' === $context ),
				'sanitize_callback' => [ __CLASS__, 'sanitize_param' ],
				'validate_callback' => [ __CLASS__, 'validate_param' ],
			],
			'attributes' => [
				'type'              => 'object',
				'default'           => [ 'async' => 'async' ],
				'sanitize_callback' => [ __CLASS__, 'sanitize_param' ],
				'validate_callback' => 'rest_validate_request_arg',
				'properties'        => self::get_allowed_script_attributes(),
			],
			'post_types' => [
				'type'              => 'array',
				'items'             => [
					'type' => 'string',
				],
				'default'           => [ 'post' ],
				'sanitize_callback' => [ __CLASS__, 'sanitize_param' ],
				'validate_callback' => 'rest_validate_request_arg',
			],
			'exclude'    => [
				'type'              => 'string',
				'sanitize_callback' => [ __CLASS__, 'sanitize_param' ],
				'validate_callback' => 'rest_validate_request_arg',
			],
		];
	}

	/**
	 * Get allowed script attributes.
	 *
	 * @since x.y.z
	 *
	 * @return array
	 */
	public static function get_allowed_script_attributes() {
		$attributes = [
			'async'                     => [ 'type' => 'string' ],
			'class'                     => [ 'type' => 'string' ],
			'id'                        => [ 'type' => 'string' ],
			'src'                       => [ 'type' => 'string' ],
			'data-color'                => [ 'type' => 'string' ],
			'data-colorful'             => [ 'type' => 'string' ],
			'data-comments-app-website' => [ 'type' => 'string' ],
			'data-dark'                 => [ 'type' => 'string' ],
			'data-dislikes'             => [ 'type' => 'string' ],
			'data-height'               => [ 'type' => 'string' ],
			'data-limit'                => [ 'type' => 'string' ],
			'data-outlined'             => [ 'type' => 'string' ],
			'data-page-id'              => [ 'type' => 'string' ],
		];

		return apply_filters( 'wptelegram_comments_allowed_script_attributes', $attributes );
	}

	/**
	 * Validate the params.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed           $value   Value of the param.
	 * @param WP_REST_Request $request WP REST API request.
	 * @param string          $key     Param key.
	 */
	public static function validate_param( $value, WP_REST_Request $request, $key ) {
		switch ( $key ) {
			case 'code':
				$pattern = '/\A<script[^<>]+?><\/script>\Z/';

				return (bool) preg_match( $pattern, $value );
		}
	}

	/**
	 * Sanitize the params before saving to DB.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed           $value   Value of the param.
	 * @param WP_REST_Request $request WP REST API request.
	 * @param string          $key     Param key.
	 */
	public static function sanitize_param( $value, WP_REST_Request $request, $key ) {
		switch ( $key ) {
			case 'code':
				$allowed_html = [
					'script' => array_map( 'boolval', self::get_allowed_script_attributes() ),
				];

				return wp_kses( $value, $allowed_html );
			case 'attributes':
			case 'post_types':
				return array_map( 'sanitize_text_field', $value );
			case 'exclude':
				return implode( ',', array_filter( array_map( 'sanitize_text_field', explode( ',', $value ) ) ) );
		}
	}
}
