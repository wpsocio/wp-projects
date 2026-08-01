<?php
/**
 * Tests for the RichHtmlConverter class.
 *
 * @package WPSocio\TelegramFormatText
 */

namespace WPSocio\TelegramFormatText\Tests;

use WPSocio\TelegramFormatText\RichHtmlConverter;

it(
	'preserves supported rich structure and removes WordPress wrappers',
	function () {
		$input = '<div class="wp-block-group"><h1 style="color:red">Title</h1><p>Text <mark>marked</mark>.</p><figure class="wp-block-image"><img src="https://example.com/image.jpg" class="size-large"><figcaption>Caption <cite>Credit</cite></figcaption></figure></div>';

		expect( ( new RichHtmlConverter() )->convert( $input ) )->toBe(
			'<h1>Title</h1><p>Text <mark>marked</mark>.</p><figure><img src="https://example.com/image.jpg"><figcaption>Caption <cite>Credit</cite></figcaption></figure>'
		);
	}
);

it(
	'removes unsafe elements attributes and media URLs',
	function () {
		$input = '<script>alert(1)</script><p onclick="alert(1)">Safe <a href="javascript:alert(1)">link</a></p><img src="data:image/png;base64,x"><video src="ftp://example.com/video.mp4"></video><tg-thinking>Draft</tg-thinking>';

		expect( ( new RichHtmlConverter() )->convert( $input ) )->toBe(
			'<p>Safe link</p>'
		);
	}
);

it(
	'unwraps semantic tags missing required attributes',
	function () {
		$input = '<p><a>Link</a> <tg-emoji>🙂</tg-emoji> <tg-time format="r">Tomorrow</tg-time> <tg-reference>Note</tg-reference></p>';

		expect( ( new RichHtmlConverter() )->convert( $input ) )->toBe(
			'<p>Link 🙂 Tomorrow Note</p>'
		);
	}
);

it(
	'preserves documented attributes only when valid',
	function () {
		$input = '<ol start="3" type="a" reversed class="list"><li value="7" type="i">Item</li></ol><table bordered striped><tr><td colspan="2" align="center" valign="bottom">Cell</td></tr></table><details open><summary>More</summary>Body</details>';

		expect( ( new RichHtmlConverter() )->convert( $input ) )->toBe(
			'<ol start="3" type="a" reversed><li value="7" type="i">Item</li></ol><table bordered striped><tr><td colspan="2" align="center" valign="bottom">Cell</td></tr></table><details open><summary>More</summary>Body</details>'
		);
	}
);

it(
	'is idempotent',
	function () {
		$converter = new RichHtmlConverter();
		$input     = '<h2>Title</h2><p>Nested <strong>content</strong>.</p>';
		$output    = $converter->convert( $input );

		expect( $converter->convert( $output ) )->toBe( $output );
	}
);

it(
	'safely trims unicode content and balances elements',
	function () {
		$input = '<h1>😀😀</h1><p>abcdef <strong>ghij</strong></p><p>removed</p>';

		expect( ( new RichHtmlConverter() )->safeTrim( $input, 'chars', 9 ) )->toBe(
			'<h1>😀😀</h1><p>abcdef …</p>'
		);
	}
);

it(
	'counts custom emoji alternative text toward the limit',
	function () {
		$input = '<p>A<img src="tg://emoji?id=123" alt="👍">BC</p>';

		expect( ( new RichHtmlConverter() )->safeTrim( $input, 'chars', 2 ) )->toBe(
			'<p>A<img src="tg://emoji?id=123" alt="👍">…</p>'
		);
	}
);

it(
	'returns converted content unchanged when under the limit',
	function () {
		$input = '<div><p>Hello</p></div>';

		expect( ( new RichHtmlConverter() )->safeTrim( $input, 'chars', 5 ) )->toBe( '<p>Hello</p>' );
	}
);
