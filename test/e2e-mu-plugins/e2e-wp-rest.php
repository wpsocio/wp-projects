<?php
/**
 * The plugin main file.
 *
 * @package e2e-wp-rest
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

add_action(
	'rest_api_init',
	function () {
		$base = 'e2e-wp-rest/v1';

		register_rest_route(
			$base,
			'/option',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
					'args'                => [
						'option_name' => [
							'type'     => 'string',
							'required' => true,
						],
					],
					'callback'            => function ( WP_REST_Request $request ) {
						$option_name = sanitize_text_field( $request->get_param( 'option_name' ) );

						$option_value = get_option( $option_name );

						return new WP_REST_Response( $option_value, 200 );
					},
				],
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
					'args'                => [
						'option_name'  => [
							'type'     => 'string',
							'required' => true,
						],
						'option_value' => [
							'type'     => 'string',
							'required' => true,
						],
					],
					'callback'            => function ( WP_REST_Request $request ) {
						$option_name = sanitize_text_field( $request->get_param( 'option_name' ) );

						// We expect a JSON string.
						$option_value = sanitize_text_field( $request->get_param( 'option_value' ) );

						update_option( $option_name, $option_value );

						return new WP_REST_Response( true, 200 );
					},
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'permission_callback' => function () {
						return current_user_can( 'manage_options' );
					},
					'args'                => [
						'option_name' => [
							'type'     => 'string',
							'required' => true,
						],
					],
					'callback'            => function ( WP_REST_Request $request ) {
						$option_name = sanitize_text_field( $request->get_param( 'option_name' ) );

						delete_option( $option_name );

						return new WP_REST_Response( true, 200 );
					},
				],
			]
		);
	}
);
