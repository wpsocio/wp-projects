<?php
/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://wpsocio.com
 * @since      1.0.0
 *
 * @package    WPTelegram\Comments
 * @subpackage WPTelegram\Comments\shared
 */

namespace WPTelegram\Comments\shared;

use WPTelegram\Comments\includes\BaseClass;
use WPTelegram\Comments\includes\Utils;

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    WPTelegram\Comments
 * @subpackage WPTelegram\Comments\shared
 * @author     WP Socio
 */
class Shared extends BaseClass {

	/**
	 * Set the widget attributes.
	 *
	 * @since 1.0.0
	 * @param string   $attributes The attributes string.
	 * @param \WP_Post $post       The current post.
	 */
	public function set_widget_attributes( $attributes, $post ) {

		$attributes_array = $this->plugin()->options()->get( 'attributes' );

		$attributes_array['async']        = true;
		$attributes_array['data-page-id'] = $post->ID;

		foreach ( $attributes_array as $key => $value ) {
			$separator = $value && is_string( $value ) ? '=' : '';

			if ( $value && is_string( $value ) ) {
				$value = 'src' === $key ? esc_url( $value ) : esc_attr( $value );

				$value = sprintf( '"%s"', $value );
			} else {
				$value = '';
			}

			$attributes .= $key . $separator . $value . ' ';
		}

		return $attributes;
	}

	/**
	 * Render the comments.
	 *
	 * @since 1.1.23
	 *
	 * @param string $block_content The block HTML.
	 * @return string The HTML.
	 */
	public function render_comments( $block_content ) {

		global $post;

		if ( $this->rules_apply( $post ) ) {
			$template = $this->get_template();

			ob_start();

			load_template( $template, false );

			$block_content = ob_get_contents();

			ob_get_clean();
		}

		return $block_content;
	}

	/**
	 * Set the comments Template.
	 *
	 * @since 1.0.0
	 * @param string $template The path to the template file.
	 */
	public function set_comments_template( $template ) {

		global $post;

		if ( $this->rules_apply( $post ) ) {
			$template = $this->get_template();
		}

		return $template;
	}

	/**
	 * Get the comments Template.
	 *
	 * @since 1.1.23
	 *
	 * @return string The path to the template file.
	 */
	private function get_template() {
		$overridden_template = locate_template( 'wptelegram-comments/comments.php' );

		if ( $overridden_template ) {
			/**
			 * The value returned by locate_template() is a path to file.
			 * if either the child theme or the parent theme have overridden the template.
			 */
			if ( Utils::is_valid_theme_template( $overridden_template ) ) {
				$template = $overridden_template;
			}
		} else {
			/*
			* If neither the child nor parent theme have overridden the template,
			* we load the template from the 'partials' sub-directory of the directory this file is in.
			*/
			$template = $this->plugin()->dir( '/shared/partials/comments.php' );
		}

		return apply_filters( 'wptelegram_comments_template', $template );
	}

	/**
	 * Check if the rules apply to the post.
	 *
	 * @since 1.0.0
	 * @param \WP_Post $post The current post.
	 * @return bool
	 */
	private function rules_apply( $post ) {

		if (
			! $post
			|| ! is_object( $post )
			|| ! comments_open( $post )
			|| ! is_singular()
			|| ! post_type_supports( $post->post_type, 'comments' )
		) {
			$rules_apply = false;
		} else {
			// check if the rules apply to the post.
			$rules_apply = $this->check_for_rules( $post );
		}

		return (bool) apply_filters( 'wptelegram_comments_post_rules_apply', $rules_apply, $post );
	}

	/**
	 * Check if the rules apply to the post.
	 *
	 * @since 1.0.0
	 * @param \WP_Post $post The current post.
	 * @return bool
	 */
	private function check_for_rules( $post ) {

		$options = $this->plugin()->options();

		$post_types = $options->get( 'post_types', [] );

		if ( ! in_array( $post->post_type, $post_types, true ) ) {
			return false;
		}

		$excluded = array_map( 'intval', explode( ',', $options->get( 'exclude', '' ) ) );

		if ( in_array( $post->ID, $excluded, true ) ) {
			return false;
		}

		return true;
	}
}
