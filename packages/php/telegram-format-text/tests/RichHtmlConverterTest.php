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

it(
	'keeps the ellipsis out of elements that accept only element children',
	function () {
		$converter = new RichHtmlConverter();

		// The trailing media block is dropped, so the figure must not receive the ellipsis.
		expect( $converter->safeTrim( '<p>abcde</p><figure><img src="https://example.com/a.jpg"></figure>', 'chars', 3 ) )
			->toBe( '<p>abc…</p>' );

		// An emptied table must not hold a bare text node.
		expect( $converter->safeTrim( '<p>abc</p><table><tr><td>defgh</td></tr></table>', 'chars', 3 ) )
			->toBe( '<p>abc…</p>' );

		// A partially retained table keeps the ellipsis inside the last cell.
		expect( $converter->safeTrim( '<table><tr><td>abcdefghij</td></tr></table>', 'chars', 5 ) )
			->toBe( '<table><tr><td>abcde…</td></tr></table>' );
	}
);

it(
	'preserves every documented rich block family',
	function () {
		$input = '<h1>H</h1><p>Text</p><pre><code class="language-php">echo 1;</code></pre><footer>F</footer><hr>'
			. '<ul><li><input type="checkbox" checked>Task</li></ul><ol start="2"><li>Item</li></ol>'
			. '<blockquote>Quote<br>More<cite>Author</cite></blockquote><aside>Pull<cite>Author</cite></aside>'
			. '<figure><audio src="https://example.com/a.mp3"></audio><figcaption>Cap<cite>Credit</cite></figcaption></figure>'
			. '<tg-map lat="41.9" long="12.5" zoom="14"></tg-map><tg-collage><img src="https://example.com/a.jpg"></tg-collage>'
			. '<tg-slideshow><video src="https://example.com/v.mp4"></video></tg-slideshow>'
			. '<table bordered><caption>C</caption><tr><th>H</th></tr><tr><td>V</td></tr></table>'
			. '<details open><summary>S</summary>Body</details><tg-math-block>E = mc^2</tg-math-block>'
			. '<p><tg-emoji emoji-id="5368324170671202286"></tg-emoji><tg-time unix="1647531900" format="wDT">soon</tg-time>'
			. '<tg-math>x^2</tg-math><tg-reference name="note-1">Ref</tg-reference><a href="#note-1">Link</a>'
			. '<mark>m</mark><sub>s</sub><sup>S</sup><tg-spoiler>sp</tg-spoiler></p>';

		expect( ( new RichHtmlConverter() )->convert( $input ) )->toBe( $input );
	}
);

it(
	'drops table sections that Telegram does not support',
	function () {
		$input = '<table><thead><tr><th>H</th></tr></thead><tbody><tr><td>C</td></tr></tbody></table>';

		expect( ( new RichHtmlConverter() )->convert( $input ) )->toBe( '<table><tr><th>H</th></tr><tr><td>C</td></tr></table>' );
	}
);

it(
	'restores the libxml error state',
	function () {
		$previous = libxml_use_internal_errors( false );

		( new RichHtmlConverter() )->convert( '<p>Hello</p>' );

		expect( libxml_use_internal_errors( $previous ) )->toBeFalse();
	}
);
