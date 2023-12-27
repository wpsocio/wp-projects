<?php
/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://wpsocio.com
 * @since      1.0.0
 *
 * @package    WPTelegram_Widget
 * @subpackage WPTelegram_Widget/public
 */

namespace WPTelegram\Widget\shared;

use WPTelegram\Widget\includes\BaseClass;
use WPTelegram\Widget\includes\AssetManager;
use WPTelegram\Widget\shared\shortcodes\JoinChannel;

/**
 * The public-facing functionality of the plugin.
 *
 * The public-facing functionality of the plugin.
 *
 * @package    WPTelegram_Widget
 * @subpackage WPTelegram_Widget/public
 * @author     WP Socio
 */
class Shared extends BaseClass {

	/**
	 * Use ugly URLs
	 *
	 * @since 1.0.0
	 * @access public
	 * @var bool $use_ugly_urls Whether to use ugly URLS.
	 */
	public static $use_ugly_urls;

	/**
	 * Sets the value for ugly URLs flag.
	 *
	 * @since 2.1.0
	 */
	public function set_use_ugly_urls() {
		self::$use_ugly_urls = apply_filters( 'wptelegram_widget_view_use_ugly_urls', false );
	}

	/**
	 * Register the stylesheets for blocks.
	 *
	 * @since 1.8.0
	 */
	public function register_blocks() {

		if ( ! function_exists( 'register_block_type' ) ) {
			return;
		}

		$style_handles = $this->plugin()->assets()->get_entry_style_handles( AssetManager::BLOCKS_ENTRY );

		register_block_type(
			'wptelegram/widget-join-channel',
			[
				'style_handles'   => $style_handles,
				'render_callback' => [ JoinChannel::class, 'render' ],
			]
		);
	}

	/**
	 * Register the URL rewrite
	 *
	 * @since    1.4.0
	 */
	public function add_rewrite_rules() {

		add_rewrite_tag( '%core%', '([^&]+)' );
		add_rewrite_tag( '%module%', '([^&]+)' );
		add_rewrite_tag( '%action%', '([^&]+)' );
		add_rewrite_tag( '%username%', '([^&]+)' );
		add_rewrite_tag( '%message_id%', '([^&]+)' );

		// For embedded post (legacy widget).
		add_rewrite_rule( '^wptelegram/widget/view/@([a-zA-Z]\w{3,30}[^\W_])/([0-9]+)/?', 'index.php?core=wptelegram&module=widget&action=view&username=$matches[1]&message_id=$matches[2]', 'top' );

		// For embedded widget.
		add_rewrite_rule( '^wptelegram/widget/view/@([a-zA-Z]\w{3,30}[^\W_])/?', 'index.php?core=wptelegram&module=widget&action=view&username=$matches[1]', 'top' );
	}

	/**
	 * Set the iframe embed Template based on WP Query.
	 *
	 * @since 1.4.0
	 * @param string $template The page template to be used.
	 */
	public function set_embed_template( $template ) {

		global $wp_query;
		$qvs = $wp_query->query_vars;

		if (
			isset( $qvs['core'], $qvs['module'], $qvs['action'], $qvs['username'] )
			&& 'wptelegram' === $qvs['core'] && 'widget' === $qvs['module']
			) {

			if ( 'view' === $qvs['action'] ) {

				$saved_usernames = [
					strtolower( WPTG_Widget()->options()->get_path( 'ajax_widget.username' ) ),
					strtolower( WPTG_Widget()->options()->get_path( 'legacy_widget.username' ) ),
				];
				// Whether to allow embeds for all channels.
				$allow_all_embeds = apply_filters( 'wptelegram_widget_allow_embeds_for_all', true, $qvs['username'] );
				// Dynamic filter based on the username.
				$allow_all_embeds = apply_filters( "wptelegram_widget_allow_embeds_for_{$qvs['username']}", $allow_all_embeds );

				if ( $allow_all_embeds || in_array( strtolower( $qvs['username'] ), $saved_usernames, true ) ) {

					// if it's for single post.
					if ( isset( $qvs['message_id'] ) ) {

						$template = __DIR__ . '/partials/single-message-embed.php';

					} else {

						$template = __DIR__ . '/partials/ajax-widget-embed.php';
					}
				} else {
					status_header( 401 );
					exit;
				}
			}
		}

		return $template;
	}

	/**
	 * Set the Template for /v request by Telegram JS.
	 *
	 * @since 1.9.3
	 * @param string $template The page template to be used.
	 */
	public function intercept_v_template( $template ) {

		global $wp_query;
		$qvs = $wp_query->query_vars;

		if ( is_404() && ! empty( $qvs['name'] ) && 'v' === $qvs['name'] ) {
			status_header( 200 );
			$template = __DIR__ . '/partials/v.php';
		}

		return $template;
	}

	/**
	 * Adds join link to post content.
	 *
	 * @since 1.9.0
	 *
	 * @param string $content Content of the current post.
	 */
	public function add_join_link_to_post_content( $content ) {
		$post_types = WPTG_Widget()->options()->get_path( 'join_link.post_types', '' );
		$link       = WPTG_Widget()->options()->get_path( 'join_link.url', '' );
		$text       = WPTG_Widget()->options()->get_path( 'join_link.text', '' );

		if ( empty( $post_types ) || ! is_singular( $post_types ) || ! $link || ! $text ) {
			return $content;
		}
		$position = WPTG_Widget()->options()->get_path( 'join_link.position', 'after_content' );

		$join_link = JoinChannel::render( compact( 'link', 'text' ) );

		return 'after_content' === $position ? $content . $join_link : $join_link . $content;
	}

	/**
	 * Pull updates from Telegram
	 *
	 * @since 1.5.0
	 */
	public function may_be_fire_pull_updates() {
		// phpcs:ignore
		if ( isset( $_GET['action'] ) && 'wptelegram_widget_pull_updates' === $_GET['action'] ) {
			do_action( 'wptelegram_widget_pull_the_updates' );
			exit( ':)' );
		}
	}

	/**
	 * Pull the updates from Telegram
	 *
	 * @since 1.5.0
	 */
	public function cron_pull_updates() {
		do_action( 'wptelegram_widget_pull_the_updates' );
	}

	/**
	 * Add custom schedules.
	 *
	 * @since 1.0.0
	 *
	 * @param array $schedules The WP Cron shedules.
	 */
	public function custom_cron_schedules( $schedules ) {
		$schedules['wptelegram_five_minutely'] = [
			'interval' => 5 * MINUTE_IN_SECONDS, // Intervals in seconds.
			'display'  => __( 'Every 5 Minutes', 'wptelegram-widget' ),
		];
		return $schedules;
	}
}
