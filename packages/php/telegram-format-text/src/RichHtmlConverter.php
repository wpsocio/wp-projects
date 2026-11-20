<?php
/**
 * Converts HTML to Telegram Rich HTML.
 *
 * @package WPSocio\TelegramFormatText
 */

namespace WPSocio\TelegramFormatText;

use DOMDocument;
use DOMElement;
use DOMNode;
use DOMText;
use WPSocio\TelegramFormatText\Exceptions\ConverterException;

/**
 * Converts and limits Telegram Rich HTML without changing its structure.
 */
class RichHtmlConverter implements HtmlConverterInterface {

	/**
	 * Telegram's maximum rich-message text length.
	 */
	const TG_RICH_TEXT_MAX_LENGTH = 32768;

	/**
	 * Telegram Rich HTML allowlist.
	 *
	 * @var array<string, array<string, bool>>
	 */
	private const ALLOWED_HTML = [
		'a'             => [
			'href' => true,
			'name' => true,
		],
		'audio'         => [ 'src' => true ],
		'aside'         => [],
		'b'             => [],
		'blockquote'    => [],
		'br'            => [],
		'caption'       => [],
		'cite'          => [],
		'code'          => [ 'class' => true ],
		'del'           => [],
		'details'       => [ 'open' => true ],
		'em'            => [],
		'figcaption'    => [],
		'figure'        => [],
		'footer'        => [],
		'h1'            => [],
		'h2'            => [],
		'h3'            => [],
		'h4'            => [],
		'h5'            => [],
		'h6'            => [],
		'hr'            => [],
		'i'             => [],
		'img'           => [
			'alt'        => true,
			'src'        => true,
			'tg-spoiler' => true,
		],
		'input'         => [
			'checked' => true,
			'type'    => true,
		],
		'ins'           => [],
		'li'            => [
			'type'  => true,
			'value' => true,
		],
		'mark'          => [],
		'ol'            => [
			'reversed' => true,
			'start'    => true,
			'type'     => true,
		],
		'p'             => [],
		'pre'           => [],
		's'             => [],
		'strike'        => [],
		'strong'        => [],
		'sub'           => [],
		'summary'       => [],
		'sup'           => [],
		'table'         => [
			'bordered' => true,
			'striped'  => true,
		],
		'td'            => [
			'align'   => true,
			'colspan' => true,
			'rowspan' => true,
			'valign'  => true,
		],
		'tg-collage'    => [],
		'tg-emoji'      => [ 'emoji-id' => true ],
		'tg-map'        => [
			'lat'  => true,
			'long' => true,
			'zoom' => true,
		],
		'tg-math'       => [],
		'tg-math-block' => [],
		'tg-reference'  => [ 'name' => true ],
		'tg-slideshow'  => [],
		'tg-spoiler'    => [],
		'tg-time'       => [
			'format' => true,
			'unix'   => true,
		],
		'th'            => [
			'align'   => true,
			'colspan' => true,
			'rowspan' => true,
			'valign'  => true,
		],
		'tr'            => [],
		'u'             => [],
		'ul'            => [],
		'video'         => [
			'src'        => true,
			'tg-spoiler' => true,
		],
	];

	/**
	 * Elements that never contain text of their own.
	 *
	 * @var string[]
	 */
	private const TEXTLESS_ELEMENTS = [ 'figure', 'ol', 'table', 'tg-collage', 'tg-slideshow', 'tr', 'ul' ];

	/**
	 * Elements that cannot hold child nodes.
	 *
	 * @var string[]
	 */
	private const VOID_ELEMENTS = [ 'audio', 'br', 'hr', 'img', 'input', 'tg-map', 'video' ];

	/**
	 * Ellipsis appended after truncated content.
	 *
	 * @var string
	 */
	private $elipsis;

	/**
	 * Constructor.
	 *
	 * @param array<string, mixed> $options Converter options.
	 */
	public function __construct( $options = [] ) {
		$this->elipsis = isset( $options['elipsis'] ) ? (string) $options['elipsis'] : '…';
	}

	/**
	 * Return the canonical Telegram Rich HTML allowlist.
	 *
	 * @return array<string, array<string, bool>>
	 */
	public static function getAllowedHtml() {
		return self::ALLOWED_HTML;
	}

	/**
	 * Invoke the converter.
	 *
	 * @param string $html HTML to convert.
	 * @return string
	 */
	public function __invoke( string $html ) {
		return $this->convert( $html );
	}

	/**
	 * Convert HTML to Telegram Rich HTML.
	 *
	 * @param string $html HTML to convert.
	 * @return string
	 */
	public function convert( string $html ) {
		if ( '' === trim( $html ) ) {
			return '';
		}

		[ $document, $root ] = $this->createDocument( $html );
		$this->sanitizeChildren( $root );

		return $this->serializeChildren( $root );
	}

	/**
	 * Safely limit Rich HTML without breaking its DOM structure.
	 *
	 * @param string $html    HTML to trim.
	 * @param string $limitBy Either chars or words.
	 * @param int    $limit   Maximum logical length.
	 * @return string
	 */
	public function safeTrim( string $html, string $limitBy = 'chars', int $limit = self::TG_RICH_TEXT_MAX_LENGTH ) {
		$converted = $this->convert( $html );

		if ( '' === $converted || 0 >= $limit ) {
			return 0 >= $limit && '' !== $converted ? $this->elipsis : $converted;
		}

		[ $document, $root ] = $this->createDocument( $converted );
		$count               = $this->getLogicalLength( $root, $limitBy );

		if ( $count <= $limit ) {
			return $converted;
		}

		// Keep room for the ellipsis so the result stays within the limit.
		$remaining = max( 0, $limit - $this->getTextLength( $this->elipsis, $limitBy ) );

		$this->trimNode( $root, $limitBy, $remaining );
		$this->appendEllipsis( $root, $document );

		return $this->serializeChildren( $root );
	}

	/**
	 * Create a wrapped DOM document.
	 *
	 * @param string $html HTML to parse.
	 * @return array{DOMDocument, DOMElement}
	 * @throws ConverterException When the HTML cannot be parsed.
	 */
	private function createDocument( string $html ) {
		$document                      = new DOMDocument( '1.0', 'UTF-8' );
		$document->strictErrorChecking = false;
		$document->recover             = true;

		$internal_errors = libxml_use_internal_errors( true );
		$loaded          = $document->loadHTML(
			'<?xml encoding="UTF-8"><div id="tg-rich-root">' . $html . '</div>',
			LIBXML_NOWARNING | LIBXML_NOERROR | LIBXML_NONET | LIBXML_PARSEHUGE
		);
		libxml_clear_errors();
		libxml_use_internal_errors( $internal_errors );

		$root = $document->getElementById( 'tg-rich-root' );
		if ( ! $loaded || ! $root ) {
			throw new ConverterException( 'Unable to load Rich HTML.', 'load_rich_html_failed', $html );
		}

		return [ $document, $root ];
	}

	/**
	 * Sanitize descendants in place.
	 *
	 * @param DOMNode $parent Parent node.
	 * @return void
	 */
	private function sanitizeChildren( DOMNode $parent ) {
		$child = $parent->firstChild;
		while ( $child ) {
			$next = $child->nextSibling;

			if ( $child instanceof DOMElement ) {
				$tag = strtolower( $child->tagName );
				if ( in_array( $tag, [ 'form', 'iframe', 'object', 'script', 'style', 'tg-thinking' ], true ) ) {
					$parent->removeChild( $child );
				} elseif ( ! isset( self::ALLOWED_HTML[ $tag ] ) ) {
					$this->sanitizeChildren( $child );
					$this->unwrapElement( $child );
				} else {
					$this->sanitizeAttributes( $child, $tag );
					if ( in_array( $tag, [ 'audio', 'img', 'video' ], true ) && ! $child->hasAttribute( 'src' ) ) {
						$parent->removeChild( $child );
					} elseif ( 'input' === $tag && 'checkbox' !== $child->getAttribute( 'type' ) ) {
						$parent->removeChild( $child );
					} elseif ( $this->isIncompleteElement( $child, $tag ) ) {
						$this->sanitizeChildren( $child );
						$this->unwrapElement( $child );
					} else {
						$this->sanitizeChildren( $child );
					}
				}
			} elseif ( XML_COMMENT_NODE === $child->nodeType ) {
				$parent->removeChild( $child );
			}

			$child = $next;
		}
	}

	/**
	 * Whether a semantic element is missing a required attribute.
	 *
	 * @param DOMElement $element Element to inspect.
	 * @param string     $tag     Element tag.
	 * @return bool
	 */
	private function isIncompleteElement( DOMElement $element, string $tag ) {
		switch ( $tag ) {
			case 'a':
				return ! $element->hasAttribute( 'href' ) && ! $element->hasAttribute( 'name' );
			case 'tg-emoji':
				return ! $element->hasAttribute( 'emoji-id' );
			case 'tg-reference':
				return ! $element->hasAttribute( 'name' );
			case 'tg-time':
				return ! $element->hasAttribute( 'unix' );
			default:
				return false;
		}
	}

	/**
	 * Replace an element with its children.
	 *
	 * @param DOMElement $element Element to unwrap.
	 * @return void
	 */
	private function unwrapElement( DOMElement $element ) {
		$parent = $element->parentNode;
		if ( ! $parent ) {
			return;
		}

		while ( $element->firstChild ) {
			$parent->insertBefore( $element->firstChild, $element );
		}
		$parent->removeChild( $element );
	}

	/**
	 * Remove unsupported and invalid attributes.
	 *
	 * @param DOMElement $element Element to sanitize.
	 * @param string     $tag     Element tag.
	 * @return void
	 */
	private function sanitizeAttributes( DOMElement $element, string $tag ) {
		$allowed = self::ALLOWED_HTML[ $tag ];
		$names   = [];
		foreach ( $element->attributes as $attribute ) {
			$names[] = $attribute->name;
		}

		foreach ( $names as $name ) {
			$value = $element->getAttribute( $name );
			if ( ! isset( $allowed[ $name ] ) || ! $this->isValidAttribute( $tag, $name, $value ) ) {
				$element->removeAttribute( $name );
			}
		}
	}

	/**
	 * Validate an attribute value.
	 *
	 * @param string $tag   Element tag.
	 * @param string $name  Attribute name.
	 * @param string $value Attribute value.
	 * @return bool
	 */
	private function isValidAttribute( string $tag, string $name, string $value ) {
		if ( 'href' === $name ) {
			return (bool) preg_match(
				'~^(?:https?://\S+|mailto:[^\s@]+@\S+|tel:\+?[\d\s().-]+|tg://user\?id=\d+|#[A-Za-z0-9_.:-]+)\z~iu',
				$value
			);
		}

		if ( 'src' === $name ) {
			if ( 'img' === $tag && preg_match( '#^tg://emoji\?id=\d+\z#', $value ) ) {
				return true;
			}
			return (bool) preg_match( '#^https?://\S+\z#iu', $value );
		}

		if ( 'class' === $name ) {
			return 'code' === $tag && (bool) preg_match( '/^language-[A-Za-z0-9_+-]+$/', $value );
		}

		if ( 'emoji-id' === $name ) {
			return (bool) preg_match( '/^\d+$/', $value );
		}

		if ( 'name' === $name ) {
			return '' !== trim( $value );
		}

		if ( in_array( $name, [ 'colspan', 'rowspan', 'start', 'unix', 'value', 'zoom' ], true ) ) {
			return (bool) preg_match( '/^-?\d+$/', $value );
		}

		if ( in_array( $name, [ 'lat', 'long' ], true ) ) {
			return is_numeric( $value );
		}

		if ( 'align' === $name ) {
			return in_array( $value, [ 'left', 'center', 'right' ], true );
		}

		if ( 'valign' === $name ) {
			return in_array( $value, [ 'top', 'middle', 'bottom' ], true );
		}

		if ( 'type' === $name && 'input' === $tag ) {
			return 'checkbox' === $value;
		}

		if ( 'type' === $name ) {
			return (bool) preg_match( '/^[1aAiI]$/', $value );
		}

		return true;
	}

	/**
	 * Get Telegram's logical length for a subtree.
	 *
	 * @param DOMNode $node    Root node.
	 * @param string  $limitBy Length unit.
	 * @return int
	 */
	private function getLogicalLength( DOMNode $node, string $limitBy ) {
		$text = $this->getLogicalText( $node );

		if ( 'words' === $limitBy ) {
			preg_match_all( '/[\p{L}\p{N}\p{M}]+(?:[\'’_-][\p{L}\p{N}\p{M}]+)*/u', $text, $matches );
			return count( $matches[0] );
		}

		return mb_strlen( $text );
	}

	/**
	 * Get logical text including image-form custom emoji fallback text.
	 *
	 * @param DOMNode $node Root node.
	 * @return string
	 */
	private function getLogicalText( DOMNode $node ) {
		if ( $node instanceof DOMText ) {
			return $node->nodeValue;
		}

		if ( $node instanceof DOMElement && 'img' === strtolower( $node->tagName ) && 0 === strpos( $node->getAttribute( 'src' ), 'tg://emoji?id=' ) ) {
			return $node->getAttribute( 'alt' );
		}

		$text = '';
		foreach ( $node->childNodes as $child ) {
			$text .= $this->getLogicalText( $child );
		}
		return $text;
	}

	/**
	 * Trim descendants to the supplied remaining amount.
	 *
	 * @param DOMNode $parent    Parent node.
	 * @param string  $limitBy   Length unit.
	 * @param int     $remaining Remaining length.
	 * @return void
	 */
	private function trimNode( DOMNode $parent, string $limitBy, int &$remaining ) {
		$child = $parent->firstChild;
		while ( $child ) {
			$next = $child->nextSibling;
			if ( 0 >= $remaining ) {
				$parent->removeChild( $child );
			} elseif ( $child instanceof DOMText ) {
				$length = $this->getTextLength( $child->nodeValue, $limitBy );
				if ( $length > $remaining ) {
					$child->nodeValue = $this->limitText( $child->nodeValue, $limitBy, $remaining );
					$remaining        = 0;
				} else {
					$remaining -= $length;
				}
			} elseif ( $child instanceof DOMElement && 'img' === strtolower( $child->tagName ) && 0 === strpos( $child->getAttribute( 'src' ), 'tg://emoji?id=' ) ) {
				$length = $this->getTextLength( $child->getAttribute( 'alt' ), $limitBy );
				if ( $length > $remaining ) {
					$parent->removeChild( $child );
					$remaining = 0;
				} else {
					$remaining -= $length;
				}
			} else {
				$this->trimNode( $child, $limitBy, $remaining );
			}
			$child = $next;
		}
	}

	/**
	 * Get a string length in the selected unit.
	 *
	 * @param string $text    Text to measure.
	 * @param string $limitBy Length unit.
	 * @return int
	 */
	private function getTextLength( string $text, string $limitBy ) {
		if ( 'words' === $limitBy ) {
			preg_match_all( '/[\p{L}\p{N}\p{M}]+(?:[\'’_-][\p{L}\p{N}\p{M}]+)*/u', $text, $matches );
			return count( $matches[0] );
		}
		return mb_strlen( $text );
	}

	/**
	 * Limit a text node.
	 *
	 * @param string $text    Text to limit.
	 * @param string $limitBy Length unit.
	 * @param int    $limit   Maximum length.
	 * @return string
	 */
	private function limitText( string $text, string $limitBy, int $limit ) {
		if ( 'words' !== $limitBy ) {
			return mb_substr( $text, 0, $limit );
		}

		if ( ! preg_match_all( '/[\p{L}\p{N}\p{M}]+(?:[\'’_-][\p{L}\p{N}\p{M}]+)*/u', $text, $matches, PREG_OFFSET_CAPTURE ) || count( $matches[0] ) <= $limit ) {
			return $text;
		}

		$match = $matches[0][ $limit - 1 ];
		return substr( $text, 0, $match[1] + strlen( $match[0] ) );
	}

	/**
	 * Append an ellipsis inside the final retained block.
	 *
	 * @param DOMElement  $root     Root element.
	 * @param DOMDocument $document DOM document.
	 * @return void
	 */
	private function appendEllipsis( DOMElement $root, DOMDocument $document ) {
		$target = $root;

		// Descend to the innermost trailing element that can hold children.
		while ( $target->lastChild instanceof DOMElement && ! in_array( strtolower( $target->lastChild->tagName ), self::VOID_ELEMENTS, true ) ) {
			$target = $target->lastChild;
		}

		// Climb back out of tables and lists, which accept only element children.
		while ( $target !== $root && in_array( strtolower( $target->tagName ), self::TEXTLESS_ELEMENTS, true ) ) {
			$target = $target->parentNode;
		}

		$target->appendChild( $document->createTextNode( $this->elipsis ) );
	}

	/**
	 * Serialize a wrapper's children without the wrapper itself.
	 *
	 * @param DOMElement $root Root element.
	 * @return string
	 */
	private function serializeChildren( DOMElement $root ) {
		$html = '';
		foreach ( $root->childNodes as $child ) {
			$html .= $root->ownerDocument->saveHTML( $child );
		}
		return trim( $html );
	}
}
