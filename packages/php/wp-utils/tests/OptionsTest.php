<?php
/**
 * Tests for the HtmlConverter class.
 *
 * @package WPSocio\TelegramFormatText
 *
 * @phpcs:disable Squiz.Commenting.ClassComment,Squiz.Commenting.FunctionComment, PEAR.Functions.FunctionCallSignature.ContentAfterOpenBracket,PEAR.Functions.FunctionCallSignature.MultipleArguments,PEAR.Functions.FunctionCallSignature.CloseBracketLine
 */

namespace WPSocio\WPUtils\Tests;

use WPSocio\WPUtils\Options;

require_once __DIR__ . '/mock-wp-functions.php';

beforeEach(function () {
	global $options_db;

	$options_db = [];
});

it( 'creates an empty array', function () {
	$this->assertEquals( [], ( new Options() )->get_data() );
	$this->assertEquals( [], ( new Options( 'test' ) )->get_data() );
	$this->assertEquals( [], ( new Options( 'test', true ) )->get_data() );
} );

it('reads the data from the database', function () {

	update_option( 'test', [ 'foo' => 'bar' ] );

	$this->assertEquals(
		get_option( 'test' ),
		( new Options( 'test' ) )->get_data()
	);

	update_option( 'test', json_encode( [ 'foo' => 'bar' ] ) );

	$this->assertEquals(
		json_decode( get_option( 'test' ), true ),
		( new Options( 'test', true ) )->get_data()
	);
	$this->assertEquals(
		'bar',
		( new Options( 'test', true ) )->get( 'foo' )
	);
});

it('updates the data in the database', function () {

	$options = new Options( 'test' );

	$this->assertTrue(
		$options->set_data( [ 'foo' => 'bar' ] )->update_data()
	);
	$this->assertEquals( [ 'foo' => 'bar' ], get_option( 'test' ) );

	$this->assertEquals( 'bar', get_option( 'test' )['foo'] );

	$options->set( 'foo', 'baz' );

	$this->assertEquals( 'baz', get_option( 'test' )['foo'] );
});

it('updates the data in the database as json', function () {

	$options = new Options( 'test', true );

	$this->assertTrue(
		$options->set_data( [ 'foo' => 'bar' ] )->update_data()
	);
	$this->assertEquals( json_encode( [ 'foo' => 'bar' ] ), get_option( 'test' ) );

	$options->set( 'foo', 'baz' );

	$this->assertEquals( json_encode( [ 'foo' => 'baz' ] ), get_option( 'test' ) );
});

it('gets the value by key', function () {

	$options = new Options( 'test' );

	$options->set_data( [ 'foo' => 'bar' ] );

	$this->assertEquals( 'bar', $options->get( 'foo' ) );
});

it('returns the default value if the key does not exist', function () {

	$options = new Options( 'test' );

	$this->assertEquals( 'bar', $options->get( 'foo', 'bar' ) );
});

it('sets the value by key', function () {

	$options = new Options( 'test' );

	$options->set( 'foo', 'bar' );

	$this->assertEquals( 'bar', $options->get( 'foo' ) );
});

it('returns the value using dot notation', function () {
	$options = new Options( 'test' );

	$options->set_data( [ 'foo' => [ 'bar' => 'baz' ] ] )->update_data();

	$this->assertEquals( 'baz', $options->get_path( 'foo.bar' ) );
});

it('sets the value by dot notation', function () {

	$options = new Options( 'test' );

	$options->set_path( 'foo1.bar1.baz1', 'abc1' );

	$this->assertEquals( 'abc1', $options->get_path( 'foo1.bar1.baz1' ) );

	$options->set_path( 'foo2.bar2.baz2', 'abc2' );

	$this->assertEquals( [
		'foo1' => [
			'bar1' => [
				'baz1' => 'abc1',
			],
		],
		'foo2' => [
			'bar2' => [
				'baz2' => 'abc2',
			],
		],
	], get_option( 'test' ) );

	$options->set_path( 'foo.bar', 'qux' );

	$this->assertEquals( [
		'foo1' => [
			'bar1' => [
				'baz1' => 'abc1',
			],
		],
		'foo2' => [
			'bar2' => [
				'baz2' => 'abc2',
			],
		],
		'foo'  => [
			'bar' => 'qux',
		],
	], get_option( 'test' ) );

	$options->set_path( 'foo1.bar1', null );

	$this->assertEquals( [
		'foo1' => [
			'bar1' => null,
		],
		'foo2' => [
			'bar2' => [
				'baz2' => 'abc2',
			],
		],
		'foo'  => [
			'bar' => 'qux',
		],
	], get_option( 'test' ) );
});

it('removes the value by key', function () {

	$options = new Options( 'test' );

	$options->set_data( [ 'foo' => 'bar' ] );

	$this->assertEquals( 'bar', $options->get( 'foo' ) );

	$options->remove( 'foo' );

	$this->assertEquals( [], get_option( 'test' ) );

	$this->assertFalse( $options->remove( '' ) );
});

it('returns the option key', function () {

	$options = new Options( 'test' );

	$this->assertEquals( 'test', $options->get_option_key() );
});

it('sets the option key', function () {

	$options = new Options( 'test' );

	$options->set_option_key( 'test2' );

	$this->assertEquals( 'test2', $options->get_option_key() );
});

it('returns value when accessing options as object props', function () {

	$options = new Options( 'test' );

	$options->set_data( [ 'foo' => [ 'bar' => [ 'baz' => 'val' ] ] ] );

	$this->assertEquals( [ 'bar' => [ 'baz' => 'val' ] ], $options->foo );
});

it('sets value when accessing options as object props', function () {

	$options = new Options( 'test' );

	$options->foo = 'bar';

	$this->assertEquals( 'bar', $options->get( 'foo' ) );
});

it('should unslash the data when set', function () {

	$options = new Options( 'test' );

	$options->set_data( [ 'foo' => 'bar' ] )->update_data();

	$this->assertEquals( [ 'foo' => 'bar' ], get_option( 'test' ) );

	$options->set_data( [ 'foo' => 'bar\\' ], true )->update_data();

	$this->assertEquals( [ 'foo' => 'bar' ], get_option( 'test' ) );

	$options->set_data( [ 'foo' => 'bar\\' ], false )->update_data();

	$this->assertEquals( [ 'foo' => 'bar\\' ], get_option( 'test' ) );

	$options->set_data( [ 'foo' => [ 'bar' => 'baz\\' ] ] )->update_data( true );

	$this->assertEquals( [ 'foo' => [ 'bar' => 'baz' ] ], get_option( 'test' ) );
});

it('unsets the value via object props', function () {

	$options = new Options( 'test' );

	$options->set_data( [
		'foo1' => [
			'bar' => [ 'baz' => 'val' ],
		],
		'foo2' => 'bar2',
	] );

	$this->assertEquals( [ 'bar' => [ 'baz' => 'val' ] ], $options->foo1 );

	unset( $options->foo1 );

	$this->assertEquals( [ 'foo2' => 'bar2' ], $options->get_data() );
});
