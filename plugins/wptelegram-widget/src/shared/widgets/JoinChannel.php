<?php
/**
 * The join channel widget.
 *
 * @link       https://wpsocio.com
 * @since      1.6.0
 *
 * @package    WPTelegram_Widget
 * @subpackage WPTelegram_Widget/public
 */

namespace WPTelegram\Widget\shared\widgets;

defined( 'ABSPATH' ) || die( 'No script kiddies please!' );

/**
 * Adds WP Telegram Widget widget.
 */
class JoinChannel extends \WP_Widget {

	/**
	 * Register widget with WordPress.
	 */
	public function __construct() {
		parent::__construct(
			'wptelegram_widget_join_channel',
			esc_html__( 'WP Telegram Join Channel', 'wptelegram-widget' ),
			[
				'description' => esc_html__( 'Invite users to join your Telegram channel or group by using a button.', 'wptelegram-widget' ),
			]
		);
	}

	/**
	 * Outputs the content for the widget.
	 *
	 * @since 1.6.0
	 *
	 * @param array $args     Display arguments including 'before_title', 'after_title', 'before_widget', and 'after_widget'.
	 * @param array $instance Settings for the current Pages widget instance.
	 */
	public function widget( $args, $instance ) {
		$title = ! empty( $instance['title'] ) ? $instance['title'] : '';

		/**
		 * Filters the widget title.
		 *
		 * @since 1.6.0
		 *
		 * @param string $title    The widget title. Default 'Pages'.
		 * @param array  $instance Array of settings for the current widget.
		 * @param mixed  $id_base  The widget ID.
		 */
		$title = apply_filters( 'widget_title', $title, $instance, $this->id_base );

		unset( $instance['title'] );

		$content = wptelegram_join_channel( $instance, false );

		if ( ! empty( $content ) ) {
			echo $args['before_widget']; // phpcs:ignore WordPress.Security.EscapeOutput
			if ( $title ) {
				echo $args['before_title'] . $title . $args['after_title']; // phpcs:ignore WordPress.Security.EscapeOutput
			} ?>
			<div>
				<?php echo $content; // phpcs:ignore WordPress.Security.EscapeOutput ?>
			</div>
			<?php
				echo $args['after_widget']; // phpcs:ignore WordPress.Security.EscapeOutput
		}
	}

	/**
	 * Handles updating settings for the widget instance.
	 *
	 * @since 1.6.0
	 *
	 * @param array $new_instance New settings for this instance as input by the user via WP_Widget::form().
	 * @param array $old_instance Old settings for this instance.
	 * @return array Updated settings to save.
	 */
	public function update( $new_instance, $old_instance ) {

		$instance = $old_instance;

		$instance['title'] = sanitize_text_field( $new_instance['title'] );

		$instance['link'] = sanitize_text_field( $new_instance['link'] );

		$instance['text'] = sanitize_text_field( $new_instance['text'] );

		return $instance;
	}

	/**
	 * Outputs the settings form for the widget.
	 *
	 * @since 1.6.0
	 *
	 * @param array $instance Current settings.
	 */
	public function form( $instance ) {

		$defaults = [
			'title' => '',
			'link'  => WPTG_Widget()->options()->get_path( 'join_link.url', '' ),
			'text'  => WPTG_Widget()->options()->get_path( 'join_link.text', '' ),
		];

		$instance = wp_parse_args( (array) $instance, $defaults );
		?>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php esc_html_e( 'Title', 'wptelegram-widget' ); ?>:</label>
			<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $instance['title'] ); ?>" />
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'link' ) ); ?>"><?php esc_html_e( 'Channel Link', 'wptelegram-widget' ); ?></label>
			<input type="url" value="<?php echo esc_attr( $instance['link'] ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'link' ) ); ?>" id="<?php echo esc_attr( $this->get_field_id( 'link' ) ); ?>" class="widefat" placeholder="https://t.me/WPTelegram" />
			<br />
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'text' ) ); ?>"><?php esc_html_e( 'Button text', 'wptelegram-widget' ); ?></label>
			<input type="text" value="<?php echo esc_attr( $instance['text'] ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'text' ) ); ?>" id="<?php echo esc_attr( $this->get_field_id( 'text' ) ); ?>" class="widefat" />
			<br />
		</p>
		<?php
	}
}
