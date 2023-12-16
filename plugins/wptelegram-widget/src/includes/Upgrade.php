<?php
/**
 * Do the necessary db upgrade
 *
 * @link       https://wpsocio.com
 * @since      2.0.0
 *
 * @package    WPTelegram\Widget
 * @subpackage WPTelegram\Widget\includes
 */

namespace WPTelegram\Widget\includes;

/**
 * Do the necessary db upgrade.
 *
 * Do the nececessary the incremental upgrade.
 *
 * @package    WPTelegram\Widget
 * @subpackage WPTelegram\Widget\includes
 * @author     WP Socio
 */
class Upgrade extends BaseClass {

	/**
	 * Do the necessary db upgrade, if needed
	 *
	 * @since    1.3.0
	 */
	public function do_upgrade() {

		$current_version = get_option( 'wptelegram_widget_ver', '1.2.0' );

		if ( ! version_compare( $current_version, $this->plugin()->version(), '<' ) ) {
			return;
		}

		if ( ! defined( 'WPTELEGRAM_WIDGET_DOING_UPGRADE' ) ) {
			define( 'WPTELEGRAM_WIDGET_DOING_UPGRADE', true );
		}

		$plugin_settings = $this->plugin()->options()->get_data();
		$is_new_install  = empty( $plugin_settings );

		do_action( 'wptelegram_widget_before_do_upgrade', $current_version );

		$version_upgrades = [];

		if ( ! $is_new_install ) {
			// the sequential upgrades
			// subsequent upgrade depends upon the previous one.
			$version_upgrades = [
				'1.3.0', // first upgrade.
				'1.4.0',
				'1.5.0',
				'1.6.1',
				'1.7.0',
				'1.9.0',
				'2.0.0',
				'2.0.2',
			];
		}

		// always.
		if ( ! in_array( $this->plugin()->version(), $version_upgrades, true ) ) {
			$version_upgrades[] = $this->plugin()->version();
		}

		foreach ( $version_upgrades as $target_version ) {

			if ( version_compare( $current_version, $target_version, '<' ) ) {

				$this->upgrade_to( $target_version, $is_new_install );

				$current_version = $target_version;
			}
		}

		do_action( 'wptelegram_widget_after_do_upgrade', $current_version );
	}

	/**
	 * Upgrade to a specific version
	 *
	 * @since 1.3.0
	 *
	 * @param string  $version        The plugin verion to upgrade to.
	 * @param boolean $is_new_install Whether it's a fresh install of the plugin.
	 */
	private function upgrade_to( $version, $is_new_install ) {

		// 2.0.1 becomes 2_0_1
		$_version = str_replace( '.', '_', $version );

		$method = [ $this, "upgrade_to_{$_version}" ];

		// No upgrades for fresh installations.
		if ( ! $is_new_install && is_callable( $method ) ) {

			call_user_func( $method );
		}

		update_option( 'wptelegram_widget_ver', $version );
	}

	/**
	 * Upgrade to version 1.3.0
	 *
	 * @since    1.4.0
	 */
	private function upgrade_to_1_3_0() {

		$option   = 'wptelegram_widget_messages';
		$messages = get_option( $option, [] );

		if ( ! empty( $messages ) ) {

			WPTG_Widget()->options()->set( 'messages', $messages );
		}

		delete_option( $option );

		$transient = 'wptelegram_widget_last_update_id';
		$update_id = (int) get_site_transient( $transient );
		if ( $update_id ) {
			WPTG_Widget()->options()->set( 'last_update_id', $update_id );
			delete_site_transient( $transient );
		}

		// set cron event in case of active plugin update.
		if ( ! wp_next_scheduled( 'wptelegram_widget_pull_updates' ) ) {
			wp_schedule_event( time(), 'wptelegram_five_minutely', 'wptelegram_widget_pull_updates' );
		}
	}

	/**
	 * Upgrade to version 1.4.0
	 *
	 * @since    1.4.0
	 */
	private function upgrade_to_1_4_0() {
		flush_rewrite_rules();
	}

	/**
	 * Upgrade to version 1.5.0
	 *
	 * @since    1.5.0
	 */
	private function upgrade_to_1_5_0() {
		wp_clear_scheduled_hook( 'wptelegram_widget_pull_updates' );

		// set cron event in case of active plugin update.
		if ( ! wp_next_scheduled( 'wptelegram_widget_cron_pull_updates' ) ) {
			wp_schedule_event( time(), 'wptelegram_five_minutely', 'wptelegram_widget_cron_pull_updates' );
		}
	}

	/**
	 * Upgrade to version 1.6.1
	 *
	 * @since    1.6.1
	 */
	private function upgrade_to_1_6_1() {
		flush_rewrite_rules();
	}

	/**
	 * Upgrade to version 1.7.0
	 *
	 * @since    1.7.0
	 */
	private function upgrade_to_1_7_0() {

		$google_script_url = WPTG_Widget()->options()->get( 'google_script_url' );

		if ( ! empty( $google_script_url ) ) {
			$telegram_blocked = 'yes';
		} else {
			$telegram_blocked = 'no';
		}

		WPTG_Widget()->options()->set( 'telegram_blocked', $telegram_blocked );
	}

	/**
	 * Upgrade to version 1.9.0
	 *
	 * @since    1.9.0
	 */
	private function upgrade_to_1_9_0() {

		$username = WPTG_Widget()->options()->get( 'username' );

		$field_values = [
			'join_link_post_types' => [ 'post' ],
			'join_link_position'   => 'after_content',
		];

		if ( $username ) {
			$field_values['join_link_url']  = sprintf( 'https://t.me/%s', $username );
			$field_values['join_link_text'] = sprintf( 'Join @%s on Telegram', $username );
		}

		foreach ( $field_values as $field => $value ) {
			WPTG_Widget()->options()->set( $field, $value );
		}
	}

	/**
	 * Upgrade to version 2.0.0
	 *
	 * @since    2.0.0
	 */
	private function upgrade_to_2_0_0() {

		$ajax_widget = [
			'username'      => '',
			'widget_width'  => [
				'field'   => 'width',
				'default' => '100%',
			],
			'widget_height' => [
				'field'   => 'height',
				'default' => '600',
			],
		];

		$old_fields = [
			'ajax_widget'   => $ajax_widget,
			'legacy_widget' => array_merge(
				$ajax_widget,
				[
					'bot_token'    => '',
					'author_photo' => [
						'field'   => 'author_photo',
						'default' => 'auto',
					],
					'num_messages' => [
						'field'   => 'num_messages',
						'default' => '5',
					],
				]
			),
			'join_link'     => [
				'join_link_text'       => [
					'field' => 'text',
				],
				'join_link_url'        => [
					'field' => 'url',
				],
				'join_link_post_types' => [
					'field'   => 'post_types',
					'default' => [ 'post' ],
				],
				'join_link_position'   => [
					'field'   => 'position',
					'default' => 'after_content',
				],
				'join_link_priority'   => [
					'field'   => 'priority',
					'default' => '10',
				],
			],
			'advanced'      => [
				'telegram_blocked'  => [
					'field'   => 'telegram_blocked',
					'default' => false,
				],
				'google_script_url' => '',
			],
		];

		$options = WPTG_Widget()->options();

		$new_settings = [];

		foreach ( $old_fields as $section => $fields ) {
			foreach ( $fields as $field => $data ) {
				$default = ! empty( $data['default'] ) ? $data['default'] : '';
				$value   = $options->get( $field, $default );

				$new_field = ! empty( $data['field'] ) ? $data['field'] : $field;

				$new_settings[ $section ][ $new_field ] = $value;
			}
		}

		$username         = $options->get( 'username' );
		$messages         = $options->get( 'messages', [] );
		$last_update_id   = $options->get( 'last_update_id' );
		$telegram_blocked = $options->get( 'telegram_blocked' );

		$new_settings['messages'][ strtolower( $username ) ] = $messages;

		$new_settings['last_update_id'] = $last_update_id;

		$new_settings['advanced']['telegram_blocked'] = 'yes' === $telegram_blocked;

		$options->set_data( $new_settings )->update_data();
	}

	/**
	 * Upgrade to version 2.0.2
	 *
	 * @since 2.0.2
	 */
	private function upgrade_to_2_0_2() {

		$options = $this->plugin()->options()->get_data();

		$options['join_link']['bgcolor']    = '#389ce9';
		$options['join_link']['text_color'] = '#fff';

		$this->plugin()->options()->set_data( $options )->update_data();
	}
}
