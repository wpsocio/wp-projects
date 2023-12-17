<?php
/**
 * Utils for tests.
 *
 * @package WPSocio\TelegramFormatText
 */

namespace WPSocio\TelegramFormatText\Tests;

/**
 * Class Utils
 */
class Utils {

	const FORMATS = [ 'HTML', 'Markdown', 'MarkdownV2', 'text' ];

	/**
	 * Get the path to the output file.
	 *
	 * @param string $inputFile The input file path.
	 * @param string $format    The format.
	 *
	 * @return string The output file path.
	 */
	public static function getTestOutputPath( string $inputFile, string $format ): string {

		$output_path = str_replace( '/input', '/output', $inputFile );

		$output_path = preg_replace( '/\.html$/iu', '-' . strtolower( $format ) . '.txt', $output_path );

		return $output_path;
	}

	/**
	 * Get the test input files.
	 *
	 * @return array The test input files.
	 */
	public static function getInputFiles(): array {
		return glob( __DIR__ . '/data/input/*.html' );
	}
}
