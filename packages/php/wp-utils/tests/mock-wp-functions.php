<?php
/**
 * Mocks WP functions.
 *
 * @package WPSocio\WPUtils
 *
 * @phpcs:disable Squiz.Commenting.FunctionComment.Missing
 */

global $options_db;

function get_option( $option, $default = false ) {
	global $options_db;

	if ( ! isset( $options_db[ $option ] ) ) {
		return $default;
	}

	return $options_db[ $option ];
}

function apply_filters( $hook, $value ) {
	return $value;
}

function update_option( $option, $value ) {
	global $options_db;

	$options_db[ $option ] = $value;

	return true;
}

function wp_json_encode( ...$args ) {
	return json_encode( ...$args );
}

function wp_unslash( $value ) {
	return map_deep(
		$value,
		function ( $value ) {
			return is_string( $value ) ? stripslashes( $value ) : $value;
		}
	);
}

function map_deep( $value, $callback ) {
	if ( is_array( $value ) ) {
		foreach ( $value as $index => $item ) {
			$value[ $index ] = map_deep( $item, $callback );
		}
	} elseif ( is_object( $value ) ) {
		$object_vars = get_object_vars( $value );
		foreach ( $object_vars as $property_name => $property_value ) {
			$value->$property_name = map_deep( $property_value, $callback );
		}
	} else {
		$value = call_user_func( $callback, $value );
	}

	return $value;
}
