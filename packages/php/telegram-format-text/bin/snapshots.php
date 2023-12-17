<?php
/**
 * Snapshot generator
 *
 * @package wptelegram-bot-api
 */

// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped, WordPress.WP.AlternativeFunctions

if ( file_exists( __DIR__ . '/../vendor/autoload.php' ) ) {
	require_once __DIR__ . '/../vendor/autoload.php';
}

require_once __DIR__ . '/../tests/Utils.php';

use WPSocio\TelegramFormatText\Tests\Utils;
use WPSocio\TelegramFormatText\HtmlConverter;

$files = Utils::getInputFiles();

foreach ( $files as $file ) {
	$input = file_get_contents( $file );

	foreach ( Utils::FORMATS as $format ) {

		$output_path = Utils::getTestOutputPath( $file, $format );

		$converter = new HtmlConverter( [ 'format_to' => $format ] );

		$output = $converter->convert( $input );

		file_put_contents( $output_path, $output );
	}
}
