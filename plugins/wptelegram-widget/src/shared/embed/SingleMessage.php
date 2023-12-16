<?php
/**
 * The single message embed handler.
 *
 * @link       https://wpsocio.com
 * @since      2.0.0
 *
 * @package    WPTelegram\Widget
 * @subpackage WPTelegram\Widget\shared\embed
 */

namespace WPTelegram\Widget\shared\embed;

defined( 'ABSPATH' ) || die( 'No script kiddies please!' );

use WPTelegram\Widget\includes\Utils;
use DOMDocument;
use DOMXPath;

/**
 * The single message embed handler.
 */
class SingleMessage {

	/**
	 * Render the HTML of the embedded single message.
	 *
	 * @since  1.3.0
	 *
	 * @param string $username The Telegram channel/group username.
	 * @param int    $message_id Unique identifier of group/channel message.
	 */
	public static function render( $username, $message_id ) {

		$saved_username = WPTG_Widget()->options()->get_path( 'legacy_widget.username' );

		$url = self::get_single_message_url( $username, $message_id );

		$html = Utils::send_request_to_t_dot_me_cached( $url );

		if ( empty( $html ) ) {
			return;
		}

		if ( extension_loaded( 'mbstring' ) ) {
			// fix the issue with Cyrillic characters.
			$html = mb_convert_encoding( $html, 'UTF-8', mb_detect_encoding( $html ) );
			$html = mb_convert_encoding( $html, 'HTML-ENTITIES', 'UTF-8' );
		}

		$dom = new DOMDocument();

		// phpcs:ignore WordPress.PHP.NoSilencedErrors
		@$dom->loadHTML( $html );

		$final_output = self::get_the_single_message_output( $dom );

		if ( strtolower( $saved_username ) !== strtolower( $username ) ) {
			echo $final_output; // phpcs:ignore WordPress.Security.EscapeOutput
			return;
		}

		if ( self::message_still_exists_on_telegram( $dom ) ) {
			echo $final_output; // phpcs:ignore WordPress.Security.EscapeOutput
			return;
		}

		// remove the post from saved messages.
		self::delete_message( $message_id, strtolower( $username ) );
	}

	/**
	 * Remove the post message from saved messages.
	 *
	 * @since  1.3.0
	 *
	 * @param int    $message_id Unique identifier of group/channel message.
	 * @param string $username   The channel username.
	 */
	public static function delete_message( $message_id, $username ) {

		$saved_messages    = WPTG_Widget()->options()->get( 'messages', [] );
		$username_messages = WPTG_Widget()->options()->get_path( "messages.{$username}", [] );

		// use array_keys() instead of array_search().
		$keys = array_keys( $username_messages, $message_id, true );
		unset( $username_messages[ reset( $keys ) ] );

		// destroy keys.
		$username_messages = array_values( $username_messages );

		$saved_messages[ $username ] = $username_messages;

		WPTG_Widget()->options()->set( 'messages', $saved_messages );
	}

	/**
	 * If the post is found - not deleted.
	 *
	 * Searches for "tgme_widget_message_error" class
	 * in the widget HTML
	 *
	 * @since  1.5.0
	 *
	 * @param DOMDocument $dom The dom object for the post HTML.
	 */
	public static function message_still_exists_on_telegram( $dom ) {
		$finder    = new DomXPath( $dom );
		$classname = 'tgme_widget_message_error';
		$nodes     = $finder->query( "//*[contains(concat(' ', normalize-space(@class), ' '), ' $classname ')]" );

		foreach ( $nodes as $node ) {
			// phpcs:ignore WordPress.NamingConventions.ValidVariableName -- Ignore  snake_case
			if ( preg_match( '/not found/i', $node->nodeValue ) ) {

				return false;
			}
		}

		return true;
	}

	/**
	 * Get the widget HTML after processing.
	 *
	 * @since  1.5.0
	 *
	 * @param DOMDocument $dom The dom object for the post HTML.
	 */
	public static function get_the_single_message_output( $dom ) {

		/* Inject Override style */
		$heads = $dom->getElementsByTagName( 'head' );
		// for some weird PHP installations.
		if ( $heads->length ) {
			$head            = $heads->item( 0 );
			$injected_styles = 'body.body_widget_post { min-width: initial !important; }';
			$injected_styles = apply_filters( 'wptelegram_widget_post_injected_styles', $injected_styles );

			$style_elm            = $dom->createElement( 'style', $injected_styles );
			$elm_type_attr        = $dom->createAttribute( 'type' );
			$elm_type_attr->value = 'text/css';
			$style_elm->appendChild( $elm_type_attr );
			$head->appendChild( $style_elm );
		}
		/* Inject Override style */

		/* Remove Google Analytics Code to avoid console errors */
		$scripts = $dom->getElementsByTagName( 'script' );
		foreach ( $scripts as $script ) {

			// phpcs:ignore WordPress.NamingConventions.ValidVariableName -- Ignore  snake_case
			if ( false !== strpos( $script->nodeValue, 'GoogleAnalyticsObject' ) ) {
				$script->parentNode->removeChild( $script ); // phpcs:ignore WordPress.NamingConventions.ValidVariableName -- Ignore  snake_case
				break;
			}
		}
		/* Remove Google Analytics Code to avoid console errors */

		$html = $dom->saveHTML();

		return (string) apply_filters( 'wptelegram_widget_embedded_post_output', $html, $dom );
	}

	/**
	 * Get the embed URL of the Telegram single Channel message.
	 *
	 * @since  1.5.0
	 *
	 * @param string $username The Telegram channel/group username.
	 * @param int    $message_id Unique identifier of group/channel message.
	 */
	public static function get_single_message_url( $username, $message_id ) {

		$url  = "https://t.me/{$username}/{$message_id}";
		$args = [
			'embed' => true,
		];
		if ( isset( $_GET['userpic'] ) ) { // phpcs:ignore
			$args['userpic'] = sanitize_text_field( wp_unslash( $_GET['userpic'] ) ); // phpcs:ignore
		}

		$url = add_query_arg( $args, $url );

		return (string) apply_filters( 'wptelegram_widget_single_message_url', $url, $username, $message_id );
	}
}
