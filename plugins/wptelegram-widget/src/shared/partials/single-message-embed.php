<?php
/**
 * Provide a public-facing view for a single post
 *
 * @link       https://wpsocio.com
 * @since      1.4.0
 *
 * @package    WPTelegram\Widget
 * @subpackage WPTelegram\Widget\shared\partials
 */

$username   = get_query_var( 'username', false );
$message_id = get_query_var( 'message_id', false );

if ( ! WPTelegram\Widget\includes\Utils::is_valid_tg_username( $username ) || ! preg_match( '/\A[0-9]+\z/', (string) $message_id ) ) {
	status_header( 404 );
	exit;
}

do_action( 'wptelegram_widget_single_message_embed', $username, $message_id );
