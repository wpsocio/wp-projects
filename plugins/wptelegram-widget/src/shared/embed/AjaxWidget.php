<?php
/**
 * The ajax widget embed handler.
 *
 * @link       https://wpsocio.com
 * @since      2.0.0
 *
 * @package    WPTelegram\Widget
 * @subpackage WPTelegram\Widget\shared\embed
 */

namespace WPTelegram\Widget\shared\embed;

defined( 'ABSPATH' ) || die( 'No script kiddies please!' );

use WPTelegram\Widget\shared\shortcodes\AjaxWidget as AjaxWidgetShortcode;
use WPTelegram\Widget\includes\Utils;
use WPTelegram\Widget\shared\Shared;

/**
 * The ajax widget embed handler.
 */
class AjaxWidget {

	/**
	 * Render the HTML of the embedded ajax widget.
	 *
	 * @since  2.0.0
	 *
	 * @param string $username The Telegram channel username.
	 */
	public static function render( $username ) {

		$json = false;
		// phpcs:disable WordPress.Security.NonceVerification.Recommended
		if ( isset( $_GET['url'] ) ) {

			$url = sanitize_text_field( wp_unslash( $_GET['url'] ) );

			if ( ! preg_match( '/\Ahttps:\/\/t\.me\/s\/' . $username . '.*/i', $url ) ) {
				exit;
			}

			$json = Utils::send_request_to_t_dot_me_cached(
				$url,
				[
					'method'  => 'POST',
					'headers' => [
						'X-Requested-With' => 'XMLHttpRequest',
					],
				]
			);

			if ( empty( $json ) ) {
				exit;
			}

			$output = json_decode( $json );

			$json = true;

		} else {

			$url = self::get_channel_cors_url( $username );

			$output = Utils::send_request_to_t_dot_me_cached( $url );

			if ( empty( $output ) ) {
				exit;
			}

			if ( extension_loaded( 'mbstring' ) ) {
				// fix the issue with Cyrillic characters.
				$output = mb_convert_encoding( $output, 'UTF-8', mb_detect_encoding( $output ) );
				$output = mb_convert_encoding( $output, 'HTML-ENTITIES', 'UTF-8' );
			}

			$output = self::customize_widget_output( $output );

		}

		$output = self::replace_tg_links( $output, $username );

		if ( $json ) {
			$output = json_encode( $output ); // phpcs:ignore WordPress.WP.AlternativeFunctions
		}

		// phpcs:ignore WordPress.Security.EscapeOutput
		echo $output;

		exit;
	}

	/**
	 * Inject Customizations
	 *
	 * @since  1.6.2
	 *
	 * @param string $html The widget HTML.
	 */
	public static function customize_widget_output( $html ) {

		$injected_styles  = '::-webkit-scrollbar { display: none; }' . PHP_EOL;
		$injected_styles .= '::-webkit-scrollbar-button { display: none; }' . PHP_EOL;
		$injected_styles .= 'body { -ms-overflow-style:none; }' . PHP_EOL;

		$injected_styles = apply_filters( 'wptelegram_widget_ajax_widget_injected_styles', $injected_styles );

		// Add style tag.
		$style_tag = PHP_EOL . '<style type="text/css">' . $injected_styles . '</style>';

		// Make all the links open in new tab, outside the iframe.
		$base_tag = PHP_EOL . '<base target="_blank" />';

		$customizations = $base_tag . $style_tag;

		$output = str_replace( '<head>', '<head>' . $customizations, $html );

		$pattern = '/<form[^>]+?(\s?>)/i';

		// Set the target attribute for <form>
		// to open search results in same iframe.
		$output = preg_replace_callback(
			$pattern,
			function ( $matches ) {
				return str_replace( $matches[1], ' target="_self">', $matches[0] );
			},
			$output
		);

		return apply_filters( 'wptelegram_widget_ajax_widget_customized_output', $output, $customizations, $html );
	}

	/**
	 * Replace the Telegram links with site links.
	 *
	 * @since  1.6.0
	 *
	 * @param string $content  The HTML content.
	 * @param string $username Telegram channel username.
	 */
	public static function replace_tg_links( $content, $username ) {

		$pattern = '/(?<=href=")\/s\/' . $username . '\?[^"]*?(?:before|after)=\d+[^"]*?(?=")/i';

		// Replace the ajax links.
		$content = preg_replace_callback(
			$pattern,
			function ( $matches ) use ( $username ) {
				return add_query_arg( 'url', rawurlencode( 'https://t.me' . $matches[0] ), AjaxWidgetShortcode::get_ajax_widget_embed_url( $username ) );
			},
			$content
		);

		$pattern = '/<form[^>]+?action="([^"]+)"[^>]+?>/i';

		// Replace the form action link.
		$content = preg_replace_callback(
			$pattern,
			function ( $matches ) use ( $username ) {

				// Append the fields to the <form> tag if needed.
				return str_replace( $matches[1], AjaxWidgetShortcode::get_ajax_widget_embed_url( $username ), $matches[0] ) . self::get_injected_form_fields( $username );
			},
			$content
		);

		$pattern = '/<a[^>]*?class="[^"]*?tgme_channel_join_telegram[^"]*?"[^>]*?href="([^"]+)"[^>]*?>/i';

		// Replace the join link.
		$content = preg_replace_callback(
			$pattern,
			function ( $matches ) use ( $username ) {
				return str_replace( $matches[1], "https://t.me/{$username}", $matches[0] );
			},
			$content
		);

		return $content;
	}

	/**
	 * The embedded widget needs to return some fields
	 * to be able to use the search feature
	 *
	 * @since  1.6.0
	 *
	 * @param string $username Telegram channel username.
	 */
	public static function get_injected_form_fields( $username ) {

		$html = '';

		if ( Shared::$use_ugly_urls ) {

			$fields = [
				'core'     => 'wptelegram',
				'module'   => 'widget',
				'action'   => 'view',
				'username' => $username,
			];

			foreach ( $fields as $name => $value ) {

				$html .= '<input type="hidden" name="' . $name . '" value="' . $value . '" />';
			}
		}

		return $html;
	}

	/**
	 * Get the CORS URl for the channel.
	 *
	 * @since  1.6.0
	 *
	 * @param string $username The Telegram channel/group username.
	 */
	public static function get_channel_cors_url( $username ) {

		$url = "https://t.me/s/{$username}";

		if ( isset( $_GET['q'] ) ) {
			$url = add_query_arg( 'q', sanitize_text_field( wp_unslash( $_GET['q'] ) ), $url );
		}

		return (string) apply_filters( 'wptelegram_widget_channel_cors_url', $url, $username );
	}
}
