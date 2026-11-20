<?php
/**
 * Provide a public-facing view for the whole channel
 *
 * @link       https://wpsocio.com
 * @since      1.6.0
 *
 * @package    WPTelegram\Widget
 * @subpackage WPTelegram\Widget\shared\partials
 */

$username = get_query_var( 'username', false );

if ( ! WPTelegram\Widget\includes\Utils::is_valid_tg_username( $username ) ) {
	status_header( 404 );
	exit;
}

do_action( 'wptelegram_widget_ajax_widget_embed', $username );
