<?php
/**
 * The ajax widget.
 *
 * @link       https://wpsocio.com
 * @since      1.6.0
 *
 * @package    WPTelegram\Widget
 * @subpackage WPTelegram\Widget\shared\widgets
 */

namespace WPTelegram\Widget\shared\widgets;

use WP_Widget;

defined( 'ABSPATH' ) || die( 'No script kiddies please!' );

/**
 * Adds WP Telegram Widget widget.
 */
class Ajax extends WP_Widget {

	/**
	 * Register widget with WordPress.
	 */
	public function __construct() {
		parent::__construct(
			'wptelegram_widget_ajax_widget',
			esc_html__( 'WP Telegram Ajax Widget', 'wptelegram-widget' ),
			[
				'description' => esc_html__( 'Display the Telegram Public Channel Feed in an ajax widget with infinite scroll.', 'wptelegram-widget' ),
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

		$content = wptelegram_ajax_widget( $instance, false );

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

		$instance['username'] = str_replace( '@', '', sanitize_text_field( $new_instance['username'] ) );

		$instance['width'] = sanitize_text_field( $new_instance['width'] );

		$instance['height'] = sanitize_text_field( $new_instance['height'] );

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
			'title'  => '',
			'width'  => '100%',
			'height' => 600,
		];

		// use global options.
		foreach ( $defaults as $key => $value ) {
			$defaults[ $key ] = WPTG_Widget()->options()->get_path( "ajax_widget.{$key}", $value );
		}
		$defaults['username'] = ''; // Avoid enforcing the usename.

		$instance = wp_parse_args( (array) $instance, $defaults );
		?>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php esc_html_e( 'Title', 'wptelegram-widget' ); ?>:</label>
			<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $instance['title'] ); ?>" />
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'username' ) ); ?>"><?php esc_html_e( 'Username', 'wptelegram-widget' ); ?></label>
			<input type="text" value="<?php echo esc_attr( $instance['username'] ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'username' ) ); ?>" id="<?php echo esc_attr( $this->get_field_id( 'username' ) ); ?>" class="widefat" placeholder="WPTelegram" />
			<span class="description"><?php esc_html_e( 'Channel username.', 'wptelegram-widget' ); ?>&nbsp;<?php esc_html_e( 'Leave empty for default.', 'wptelegram-widget' ); ?></span>
			<br />
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'width' ) ); ?>"><?php esc_html_e( 'Widget Width', 'wptelegram-widget' ); ?></label>
			<input type="text" value="<?php echo esc_attr( $instance['width'] ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'width' ) ); ?>" id="<?php echo esc_attr( $this->get_field_id( 'width' ) ); ?>" class="widefat" placeholder="300 <?php esc_html_e( 'or', 'wptelegram-widget' ); ?> 100%" />
			<br />
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'height' ) ); ?>"><?php esc_html_e( 'Widget Height', 'wptelegram-widget' ); ?></label>
			<input type="text" value="<?php echo esc_attr( $instance['height'] ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'height' ) ); ?>" id="<?php echo esc_attr( $this->get_field_id( 'height' ) ); ?>" class="widefat" placeholder="600" />
			<br />
		</p>
		<?php
	}
}
