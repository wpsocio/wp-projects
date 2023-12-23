<?php
/**
 * The Legacy widget shortcode handler.
 *
 * @link       https://wpsocio.com
 * @since      2.0.0
 *
 * @package    WPTelegram\Widget
 * @subpackage WPTelegram\Widget\shared\shortcodes
 */

namespace WPTelegram\Widget\shared\shortcodes;

defined( 'ABSPATH' ) || die( 'No script kiddies please!' );

use WPTelegram\Widget\includes\AssetManager;
use WPTelegram\Widget\includes\Utils;

/**
 * Handles the WP Telegram Legacy widget shortcode.
 */
class JoinChannel {

	/**
	 * Registers shortcode to display join link.
	 *
	 * @since 1.8.0
	 *
	 * @param array $atts The shortcode attributes.
	 */
	public static function render( $atts ) {

		// This shortcode depends on the blocks styles.
		$styles = WPTG_Widget()->assets()->get_entry_handles( AssetManager::BLOCKS_ENTRY, 'styles' );
		foreach ( $styles as $handle ) {
			wp_enqueue_style( $handle );
		}

		$defaults = [
			'link' => WPTG_Widget()->options()->get_path( 'join_link.url', '' ),
			'text' => WPTG_Widget()->options()->get_path( 'join_link.text', '' ),
		];

		$args = shortcode_atts( $defaults, $atts, 'wptelegram-join-channel' );

		$args = array_map( 'sanitize_text_field', $args );

		if ( empty( $args['link'] ) ) {
			$args['link'] = $defaults['link'];
		}

		if ( empty( $args['text'] ) ) {
			$args['text'] = $defaults['text'];
		}

		set_query_var( 'link', $args['link'] );
		set_query_var( 'text', $args['text'] );
		set_query_var( 'attributes', self::get_link_attributes() );

		ob_start();
		$overridden_template = locate_template( 'wptelegram-widget/join-channel.php' );
		if ( $overridden_template ) {
			/**
			 * The value returned by locate_template() is a path to file.
			 * if either the child theme or the parent theme have overridden the template.
			 */
			if ( Utils::is_valid_template( $overridden_template ) ) {
				load_template( $overridden_template );
			}
		} else {
			/*
			 * If neither the child nor parent theme have overridden the template,
			 * we load the template from the 'partials' sub-directory of the directory this file is in.
			 */
			load_template( __DIR__ . '/../partials/join-channel.php' );
		}
		$html = ob_get_clean();
		return $html;
	}

	/**
	 * Retrieve the join link attributes
	 *
	 * @since 2.1.3
	 *
	 * @return string
	 */
	public static function get_link_attributes() {
		$open_in_new_tab = WPTG_Widget()->options()->get_path( 'join_link.open_in_new_tab' );

		$attributes = [
			'target' => $open_in_new_tab ? '_blank' : '_self',
			'rel'    => 'noopener noreferrer',
		];

		$attributes = (array) apply_filters( 'wptelegram_widget_join_link_attributes', $attributes );

		$attr_str = '';

		foreach ( $attributes as $key => $value ) {
			$attr_str .= sprintf( '%1$s="%2$s" ', sanitize_text_field( $key ), esc_attr( $value ) );
		}

		return trim( $attr_str );
	}
}
