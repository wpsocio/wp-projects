<?php
/**
 * Tests for the HtmlConverter class.
 *
 * @package WPSocio\TelegramFormatText
 *
 * @phpcs:disable Squiz.Commenting.ClassComment,Squiz.Commenting.FunctionComment, PEAR.Functions.FunctionCallSignature.ContentAfterOpenBracket,PEAR.Functions.FunctionCallSignature.MultipleArguments,PEAR.Functions.FunctionCallSignature.CloseBracketLine
 */

namespace WPSocio\TelegramFormatText\Tests;

use WPSocio\TelegramFormatText\HtmlConverter;

require_once __DIR__ . '/Utils.php';

it( 'creates an instance without any options', function () {

	$this->assertInstanceOf(
		HtmlConverter::class,
		new HtmlConverter()
	);
} );

it( 'converts whitespace to empty string', function () {
	$whitespace = " \t\n ";
	$this->assertEquals(
		'',
		( new HtmlConverter() )->convert( $whitespace )
	);
} );

it( 'returns the plain text as is', function () {
	$text = 'Hello World!';
	$this->assertEquals(
		$text,
		( new HtmlConverter() )->convert( $text )
	);
} );


$files = Utils::getInputFiles();

foreach ( $files as $file ) {
	$input = file_get_contents( $file );

	foreach ( Utils::FORMATS as $format ) {
		$output_path = Utils::getTestOutputPath( $file, $format );

		$description = sprintf( 'converts %s to %s', basename( $file ), basename( $output_path ) );

		it( $description, function () use ( $input, $format, $output_path ) {
			$expected = file_get_contents( $output_path );

			$this->assertEquals(
				$expected,
				( new HtmlConverter( [ 'format_to' => $format ] ) )->convert( $input )
			);
		} );
	}
}
