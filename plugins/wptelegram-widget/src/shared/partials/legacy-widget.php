<?php
/**
 * Provide a public-facing view for the widget
 *
 * Available vars:
 * $posts, $post, $wp_did_header, $wp_query, $wp_rewrite,
 * $wpdb, $wp_version, $wp, $id, $comment, $user_ID
 *
 * $embed_urls, $width
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
	<?php
	foreach ( $embed_urls as $src ) :
		?>
		<div class="wptelegram-widget-message">
			<iframe loading="lazy" frameborder="0" scrolling="no" width="<?php echo esc_attr( $width ); ?>%" src="<?php echo esc_url( $src ); ?>">Your Browser Does Not Support iframes!</iframe>
		</div>
	<?php endforeach; ?>
</div>
<?php
