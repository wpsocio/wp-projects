<?php
/**
 * Provide a public-facing view for the widget
 *
 * Available vars:
 * $posts, $post, $wp_did_header, $wp_query, $wp_rewrite,
 * $wpdb, $wp_version, $wp, $id, $comment, $user_ID
 *
 * $embed_url, $width, $height
 *
 * @link       https://wpsocio.com
 * @since      1.0.0
 *
 * @package    WPTelegram\Widget
 * @subpackage WPTelegram\Widget\shared\partials
 */

// This file should primarily consist of HTML with a little bit of PHP.
?>
<div class="wptelegram-widget-wrap">
	<div class="wptelegram-widget-ajax-widget">
		<iframe loading="lazy" frameborder="0" width="<?php echo esc_attr( $width ); ?>" height="<?php echo esc_attr( $height ); ?>" src="<?php echo esc_url( $embed_url ); ?>">Your Browser Does Not Support iframes!</iframe>
	</div>
</div>
<?php
