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

use WPTelegram\Widget\shared\Shared;
use WPTelegram\Widget\includes\Utils;

/**
 * Handles the WP Telegram Legacy widget shortcode.
 */
class LegacyWidget {

	/**
	 * Registers shortcode to display legacy widget.
	 *
	 * @since    2.0.0
	 *
	 * @param array $atts The shortcode attributes.
	 */
	public static function render( $atts ) {

		// Backward compatible.
		if ( ! empty( $atts['widget_width'] ) ) {
			$atts['width'] = $atts['widget_width'];
		}

		// fetch messages.
		$messages = WPTG_Widget()->options()->get( 'messages', [] );
		$username = strtolower( WPTG_Widget()->options()->get_path( 'legacy_widget.username', '' ) );

		if ( empty( $messages[ $username ] ) ) {
			return;
		}

		$defaults = [
			'num_messages' => 5,
			'width'        => 100,
			'author_photo' => 'auto',
		];

		// use global options.
		foreach ( $defaults as $key => $default ) {
			$defaults[ $key ] = WPTG_Widget()->options()->get_path( "legacy_widget.{$key}", $default );
		}

		$args = shortcode_atts( $defaults, $atts, 'wptelegram-widget' );

		$args = array_map( 'sanitize_text_field', $args );

		$num_messages = absint( $args['num_messages'] );

		if ( ! $num_messages ) {
			$num_messages = 5;
		}

		$messages = array_reverse( $messages[ $username ] );

		$messages = apply_filters( 'wptelegram_widget_legacy_widget_messages', $messages, $username, $args );

		$messages = array_slice( $messages, 0, $num_messages );

		$author_photo = $args['author_photo'];

		$width = absint( $args['width'] );
		if ( ! $width || $width > 100 ) {
			$width = 100;
		}

		switch ( $author_photo ) {
			case 'always_show':
				$userpic = 'true';
				break;
			case 'always_hide':
				$userpic = 'false';
				break;
			default:
				$userpic = null;
				break;
		}

		$embed_urls = [];

		foreach ( $messages as $message_id ) {

			$embed_urls[] = self::get_single_message_embed_url( $username, $message_id, $userpic );
		}

		set_query_var( 'embed_urls', $embed_urls );
		set_query_var( 'width', $width );

		ob_start();
		$overridden_template = locate_template( 'wptelegram-widget/legacy-widget.php' );
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
			load_template( __DIR__ . '/../partials/legacy-widget.php' );
		}
		$html = ob_get_clean();
		return $html;
	}

	/**
	 * Get the iframe URL for a message view.
	 *
	 * @since 1.4.0
	 *
	 * @param string $username   The Telegram channel/group username.
	 * @param int    $message_id Unique identifier of group/channel message.
	 * @param string $userpic    Whether to display the user pic or not.
	 *
	 * @return string
	 */
	public static function get_single_message_embed_url( $username, $message_id, $userpic = null ) {

		// check for permalink structure.
		$structure = get_option( 'permalink_structure' );

		if ( empty( $structure ) || Shared::$use_ugly_urls ) {

			$args = [
				'core'       => 'wptelegram',
				'module'     => 'widget',
				'action'     => 'view',
				'username'   => $username,
				'message_id' => $message_id,
			];

			$url = add_query_arg( $args, site_url() );

		} else {

			$url = site_url( "/wptelegram/widget/view/@{$username}/{$message_id}/" );
		}

		if ( ! is_null( $userpic ) ) {
			$url = add_query_arg( 'userpic', $userpic, $url );
		}

		return (string) apply_filters( 'wptelegram_widget_single_message_embed_url', $url, $username, $message_id, $userpic );
	}
}
