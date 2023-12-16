<?php
/**
 * The ajax widget shortcode handler.
 *
 * @link       https://wpsocio.com
 * @since      2.0.0
 *
 * @package    WPTelegram\Widget
 * @subpackage WPTelegram\Widget\shared\shortcodes
 */

namespace WPTelegram\Widget\shared\shortcodes;

defined( 'ABSPATH' ) || die( 'No script kiddies please!' );

use WPTelegram\Widget\shared\Shared;
use WPTelegram\Widget\includes\Utils;

/**
 * Handles the WP Telegram Widget widget shortcode.
 */
class AjaxWidget {

	/**
	 * Registers shortcode to display the ajax channel feed.
	 *
	 * @since    1.6.0
	 *
	 * @param array $atts The shortcode attributes.
	 */
	public static function render( $atts ) {

		// Backward compatible.
		if ( ! empty( $atts['widget_width'] ) ) {
			$atts['width'] = $atts['widget_width'];
		}
		if ( ! empty( $atts['widget_height'] ) ) {
			$atts['height'] = $atts['widget_height'];
		}

		$defaults = [
			'username' => '',
			'width'    => '100%',
			'height'   => 600,
		];

		// use global options.
		foreach ( $defaults as $key => $default ) {
			$defaults[ $key ] = WPTG_Widget()->options()->get_path( "ajax_widget.{$key}", $default );
		}

		$args = shortcode_atts( $defaults, $atts, 'wptelegram-ajax-widget' );

		$args = array_map( 'sanitize_text_field', $args );

		if ( empty( $args['username'] ) ) {
			$args['username'] = $defaults['username'];
		}

		if ( empty( $args['width'] ) ) {
			$args['width'] = $defaults['width'];
		}

		if ( empty( $args['height'] ) ) {
			$args['height'] = $defaults['height'];
		}

		$embed_url = self::get_ajax_widget_embed_url( $args['username'] );

		set_query_var( 'embed_url', $embed_url );
		set_query_var( 'width', $args['width'] );
		set_query_var( 'height', $args['height'] );

		$overridden_template = locate_template( 'wptelegram-widget/ajax-widget.php' );
		ob_start();
		if ( $overridden_template ) {
			/**
			 * The value returned by locate_template() is a path to file.
			 * if either the child theme or the parent theme have overridden the template.
			 */

			if ( Utils::is_valid_template( $overridden_template ) ) {
				load_template( $overridden_template, false );
			}
		} else {
			/*
			 * If neither the child nor parent theme have overridden the template,
			 * we load the template from the 'partials' sub-directory of the directory this file is in.
			 */
			load_template( __DIR__ . '/../partials/ajax-widget.php', false );
		}
		$html = ob_get_clean();
		return $html;
	}

	/**
	 * Get the embedd URL for widget view.
	 *
	 * @since 2.0.0
	 *
	 * @param string $username   The Telegram channel/group username.
	 *
	 * @return string
	 */
	public static function get_ajax_widget_embed_url( $username ) {

		// check for permalink structure.
		$structure = get_option( 'permalink_structure' );

		if ( empty( $structure ) || Shared::$use_ugly_urls ) {

			$args = [
				'core'     => 'wptelegram',
				'module'   => 'widget',
				'action'   => 'view',
				'username' => $username,
			];

			$url = add_query_arg( $args, site_url() );

		} else {

			$url = site_url( "/wptelegram/widget/view/@{$username}/" );
		}

		return (string) apply_filters( 'wptelegram_widget_ajax_widget_url', $url, $username );
	}
}
