<?php
/**
 * The template to interept request to /v by Telegram scrip.
 *
 * @link       https://wpsocio.com
 * @since      1.9.3
 *
 * @package    WPTelegram\Widget
 * @subpackage WPTelegram\Widget\shared\partials
 */

header( 'Content-Type: application/json; charset=utf-8' );
echo 'true';
