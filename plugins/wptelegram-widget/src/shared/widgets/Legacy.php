<?php
/**
 * The legacy widget.
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
 * Adds WP Telegram Widget widget
 */
class Legacy extends \WP_Widget {

	/**
	 * Register widget with WordPress
	 */
	public function __construct() {
		parent::__construct(
			'wptelegram_widget_widget',
			esc_html__( 'WP Telegram Legacy Widget', 'wptelegram-widget' ),
			[
				'description' => esc_html__( 'Display the Telegram Public Channel or Group Feed in a widget', 'wptelegram-widget' ),
			]
		);
	}

	/**
	 * Outputs the content for the widget.
	 *
	 * @since 1.0.0
	 *
	 * @param array $args     Display arguments including 'before_title', 'after_title', 'before_widget', and 'after_widget'.
	 * @param array $instance Settings for the current Pages widget instance.
	 */
	public function widget( $args, $instance ) {
		$title = ! empty( $instance['title'] ) ? $instance['title'] : '';

		/**
		 * Filters the widget title.
		 *
		 * @since 1.0.0
		 *
		 * @param string $title    The widget title. Default 'Pages'.
		 * @param array  $instance Array of settings for the current widget.
		 * @param mixed  $id_base  The widget ID.
		 */
		$title = apply_filters( 'widget_title', $title, $instance, $this->id_base );

		unset( $instance['title'] );

		$content = wptelegram_widget( $instance, false );

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
	 * @since 1.0.0
	 *
	 * @param array $new_instance New settings for this instance as input by the user via WP_Widget::form().
	 * @param array $old_instance Old settings for this instance.
	 * @return array Updated settings to save.
	 */
	public function update( $new_instance, $old_instance ) {

		$instance = $old_instance;

		$instance['title'] = sanitize_text_field( $new_instance['title'] );

		if ( in_array( $new_instance['author_photo'], [ 'auto', 'always_show', 'always_hide' ], true ) ) {
			$instance['author_photo'] = $new_instance['author_photo'];
		} else {
			$instance['author_photo'] = 'auto';
		}

		$instance['width'] = sanitize_text_field( $new_instance['width'] );

		$instance['num_messages'] = sanitize_text_field( $new_instance['num_messages'] );
		if ( ! empty( $instance['num_messages'] ) ) {
			$instance['num_messages'] = absint( $instance['num_messages'] );
		}

		return $instance;
	}

	/**
	 * Outputs the settings form for the widget.
	 *
	 * @since 1.0.0
	 *
	 * @param array $instance Current settings.
	 */
	public function form( $instance ) {

		$defaults = [
			'title'        => '',
			'num_messages' => 5,
			'width'        => 100,
			'author_photo' => 'auto',
		];

		// Use global options.
		foreach ( $defaults as $key => $value ) {
			$defaults[ $key ] = WPTG_Widget()->options()->get_path( "legacy_widget.{$key}", $value );
		}
		$instance = wp_parse_args( (array) $instance, $defaults );
		?>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php esc_html_e( 'Title', 'wptelegram-widget' ); ?>:</label>
			<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text" value="<?php echo esc_attr( $instance['title'] ); ?>" />
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'width' ) ); ?>"><?php esc_html_e( 'Widget Width', 'wptelegram-widget' ); ?></label>
			<input type="text" value="<?php echo esc_attr( $instance['width'] ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'width' ) ); ?>" id="<?php echo esc_attr( $this->get_field_id( 'width' ) ); ?>" class="widefat" placeholder="100" />
			<br />
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'author_photo' ) ); ?>"><?php esc_html_e( 'Author Photo', 'wptelegram-widget' ); ?></label>
			<select name="<?php echo esc_attr( $this->get_field_name( 'author_photo' ) ); ?>" id="<?php echo esc_attr( $this->get_field_id( 'author_photo' ) ); ?>" class="widefat">
				<option value="auto"<?php selected( $instance['author_photo'], 'auto' ); ?>><?php esc_html_e( 'Auto', 'wptelegram-widget' ); ?></option>
				<option value="always_show"<?php selected( $instance['author_photo'], 'always_show' ); ?>><?php esc_html_e( 'Always show', 'wptelegram-widget' ); ?></option>
				<option value="always_hide"<?php selected( $instance['author_photo'], 'always_hide' ); ?>><?php esc_html_e( 'Always hide', 'wptelegram-widget' ); ?></option>
			</select>
		</p>
		<p>
			<label for="<?php echo esc_attr( $this->get_field_id( 'num_messages' ) ); ?>"><?php esc_html_e( 'Number of Messages', 'wptelegram-widget' ); ?></label>
			<input type="number" value="<?php echo esc_attr( $instance['num_messages'] ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'num_messages' ) ); ?>" id="<?php echo esc_attr( $this->get_field_id( 'num_messages' ) ); ?>" class="widefat" placeholder="5" />
			<br />
			<span class="description"><?php esc_html_e( 'Number of messages to display in the widget.', 'wptelegram-widget' ); ?></span>
		</p>
		<?php
	}
}
