<?php
/**
 * Utility methods.
 *
 * @link       https://wpsocio.com
 * @since      2.0.0
 *
 * @package    WPTelegram\Widget
 * @subpackage WPTelegram\Widget\includes
 */

namespace WPTelegram\Widget\includes;

use WPTelegram\Widget\includes\restApi\RESTController;
use WP_REST_Request;
use WP_Error;

/**
 * Utility methods.
 *
 * Utility methods.
 *
 * @package    WPTelegram\Widget
 * @subpackage WPTelegram\Widget\includes
 * @author     WP Socio
 */
class Utils {

	/**
	 * Sanitize the input.
	 *
	 * @param  mixed $input  The input.
	 * @param  bool  $typefy Whether to convert strings to the appropriate data type.
	 * @since  2.0.2
	 *
	 * @return mixed
	 */
	public static function sanitize( $input, $typefy = false ) {

		if ( is_array( $input ) ) {

			foreach ( $input as $key => $value ) {

				$input[ sanitize_text_field( $key ) ] = self::sanitize( $value, $typefy );
			}
			return $input;
		}

		// These are safe types.
		if ( is_bool( $input ) || is_int( $input ) || is_float( $input ) ) {
			return $input;
		}

		// Now we will treat it as string.
		$input = sanitize_text_field( $input );

		// avoid numeric or boolean values as strings.
		if ( $typefy ) {
			return self::typefy( $input );
		}

		return $input;
	}

	/**
	 * Convert the input into the proper data type
	 *
	 * @param  mixed $input The input.
	 * @since  2.0.2
	 *
	 * @return mixed
	 */
	public static function typefy( $input ) {

		if ( is_numeric( $input ) ) {

			return floatval( $input );

		} elseif ( is_string( $input ) && preg_match( '/^(?:true|false)$/i', $input ) ) {

			return ( 'true' === strtolower( $input ) ) ? true : false;
		}

		return $input;
	}

	/**
	 * Filter WP REST API errors.
	 *
	 * @param mixed           $response Result to send to the client. Usually a WP_REST_Response or WP_Error.
	 * @param array           $handler  Route handler used for the request.
	 * @param WP_REST_Request $request  Request used to generate the response.
	 *
	 * @since    2.0.0
	 */
	public static function fitler_rest_errors( $response, $handler, $request ) {

		$matches_route    = 0 === strpos( ltrim( $request->get_route(), '/' ), RESTController::REST_NAMESPACE );
		$is_invalid_param = is_wp_error( $response ) && 'rest_invalid_param' === $response->get_error_code();

		if ( ! $is_invalid_param || ! $matches_route ) {
			return $response;
		}

		$data = $response->get_error_data();

		$invalid_params = [];
		if ( ! empty( $data['params'] ) ) {
			foreach ( $data['params'] as $error ) {
				preg_match( '/\A\S+/', $error, $match );
				$invalid_params[ $match[0] ] = $error;
			}
		}

		$data['params'] = $invalid_params;

		return new WP_Error(
			$response->get_error_code(),
			$response->get_error_message(),
			$data
		);
	}

	/**
	 * Create a regex from the given pattern.
	 *
	 * @since    2.0.0
	 *
	 * @param string  $pattern     The pattern to match.
	 * @param boolean $allow_empty Whether to allow an ampty string.
	 * @param boolean $match_full  Whether to match the complete word.
	 * @param string  $delim       The delimiter to use.
	 *
	 * @return string
	 */
	public static function enhance_regex( $pattern, $allow_empty = false, $match_full = true, $delim = '' ) {
		if ( $allow_empty ) {
			$pattern = '(?:' . $pattern . ')?';
		}
		if ( $match_full ) {
			$pattern = '\A' . $pattern . '\Z';
		}
		if ( $delim ) {
			$pattern = $delim . $pattern . $delim;
		}
		return $pattern;
	}

	/**
	 * Check whether the template path is valid.
	 *
	 * @since 2.0.0
	 * @param string $template The template path.
	 *
	 * @return bool
	 */
	public static function is_valid_template( $template ) {
		/**
		 * Only allow templates that are in the active theme directory,
		 * parent theme directory, or the /wp-includes/theme-compat/ directory
		 * (prevent directory traversal attacks)
		 */
		$valid_paths = array_map(
			'realpath',
			[
				get_stylesheet_directory(),
				get_template_directory(),
				ABSPATH . WPINC . '/theme-compat/',
			]
		);

		$path = realpath( $template );

		foreach ( $valid_paths as $valid_path ) {
			if ( preg_match( '#\A' . preg_quote( $valid_path, '#' ) . '#', $path ) ) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Send request to t.me/... and cache the result.
	 *
	 * @since  2.1.9
	 *
	 * @param string $url  The t.me URL.
	 * @param array  $args The request args.
	 */
	public static function send_request_to_t_dot_me_cached( $url, $args = [] ) {

		$telegram_blocked  = WPTG_Widget()->options()->get_path( 'advanced.telegram_blocked' );
		$google_script_url = WPTG_Widget()->options()->get_path( 'advanced.google_script_url' );

		if ( $telegram_blocked && ! empty( $google_script_url ) ) {
			$url = $google_script_url . '?url=' . rawurlencode( $url );
		}

		$cache_duration = (int) apply_filters( 'wptelegram_widget_cache_duration', HOUR_IN_SECONDS, $url, $args );

		if ( ! $cache_duration ) {
			return self::send_request_to_t_dot_me( $url, $args );
		}

		$transient = 'wptelegram_widget_output_for_' . $url;

		$output = get_transient( $transient );

		if ( false === $output ) {
			$output = self::send_request_to_t_dot_me( $url, $args );

			set_transient( $transient, $output, $cache_duration );
		}

		return $output;
	}

	/**
	 * Send request to t.me/...
	 *
	 * @since  1.6.0
	 *
	 * @param string $url  The t.me URL.
	 * @param array  $args The request args.
	 */
	public static function send_request_to_t_dot_me( $url, $args = [] ) {
		$response = wp_remote_request( $url, $args );
		$code     = wp_remote_retrieve_response_code( $response );

		if ( 200 !== $code ) {
			return false;
		}

		$body = wp_remote_retrieve_body( $response );

		return $body;
	}

	/**
	 * Returns Jed-formatted localization data.
	 *
	 * @source gutenberg_get_jed_locale_data()
	 *
	 * @since 2.0.2
	 *
	 * @param  string $domain Translation domain.
	 *
	 * @return array
	 */
	public static function get_jed_locale_data( $domain ) {
		$translations = get_translations_for_domain( $domain );

		$locale = [
			'' => [
				'domain' => $domain,
				'lang'   => is_admin() ? get_user_locale() : get_locale(),
			],
		];

		if ( ! empty( $translations->headers['Plural-Forms'] ) ) {
			$locale['']['plural_forms'] = $translations->headers['Plural-Forms'];
		}

		foreach ( $translations->entries as $msgid => $entry ) {
			$locale[ $msgid ] = $entry->translations;
		}

		return $locale;
	}

	/**
	 * Update the menu structure to make WP Telegram the top level link.
	 */
	public static function update_menu_structure() {
		global $admin_page_hooks;

		if ( ! defined( 'WPTELEGRAM_LOADED' ) && empty( $admin_page_hooks['wptelegram'] ) ) {
			add_menu_page(
				__( 'WP Telegram', 'wptelegram-widget' ),
				__( 'WP Telegram', 'wptelegram-widget' ),
				'manage_options',
				'wptelegram',
				null,
				'',
				80
			);
			add_action( 'admin_menu', [ __CLASS__, 'remove_wptelegram_menu' ], 20 );
		}
	}

	/**
	 * Update the menu structure to remove WP Telegram top level link.
	 */
	public static function remove_wptelegram_menu() {
		global $submenu;

		if ( ! current_user_can( 'manage_options' ) || empty( $submenu['wptelegram'] ) ) {
			return;
		}

		$key = null;
		foreach ( $submenu['wptelegram'] as $submenu_key => $submenu_item ) {
			if ( 'wptelegram' === $submenu_item[2] ) {
				$key = $submenu_key;
				break;
			}
		}

		if ( null === $key ) {
			return;
		}

		unset( $submenu['wptelegram'][ $key ] );
	}
}
