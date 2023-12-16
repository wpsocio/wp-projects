<?php
/**
 * Contains the helper functions.
 *
 * @link       https://wpsocio.com
 * @since      1.0.0
 *
 * @package    WPTelegram_Widget
 * @subpackage WPTelegram_Widget/includes
 */

if ( ! function_exists( 'wptelegram_widget' ) ) {
	/**
	 * Get or display the widget
	 *
	 * @since 1.0.0
	 *
	 * @param array   $args Shortcode Params.
	 * @param boolean $echo Whether to display or return.
	 *
	 * @return NULL|string        The html output
	 */
	function wptelegram_widget( $args = [], $echo = true ) {
		$output = \WPTelegram\Widget\shared\shortcodes\LegacyWidget::render( $args );
		if ( $echo ) {
			echo $output; // phpcs:ignore WordPress.Security.EscapeOutput
		} else {
			return $output;
		}
	}
}

if ( ! function_exists( 'wptelegram_ajax_widget' ) ) {
	/**
	 * Get or display the ajax widget
	 *
	 * @since 1.0.0
	 *
	 * @param  array   $args Shortcode Params.
	 * @param  boolean $echo Whether to display or return.
	 *
	 * @return NULL|string        The html output
	 */
	function wptelegram_ajax_widget( $args = [], $echo = true ) {
		$output = \WPTelegram\Widget\shared\shortcodes\AjaxWidget::render( $args );
		if ( $echo ) {
			echo $output; // phpcs:ignore WordPress.Security.EscapeOutput
		} else {
			return $output;
		}
	}
}

if ( ! function_exists( 'wptelegram_join_channel' ) ) {
	/**
	 * Display join channel button.
	 *
	 * @since 1.8.0
	 *
	 * @param  array   $args Shortcode Params.
	 * @param  boolean $echo Whether to display or return.
	 *
	 * @return NULL|string        The html output
	 */
	function wptelegram_join_channel( $args = [], $echo = true ) {
		$output = \WPTelegram\Widget\shared\shortcodes\JoinChannel::render( $args );
		if ( $echo ) {
			echo $output; // phpcs:ignore WordPress.Security.EscapeOutput
		} else {
			return $output;
		}
	}
}
