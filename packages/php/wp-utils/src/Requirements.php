<?php
/**
 * Provides the Requirements class.
 *
 * This file should ideally NOT contain the latest PHP syntax
 * to allow its use in older PHP versions.
 *
 * @link       https://wpsocio.com
 *
 * @package    WPSocio
 * @subpackage WPSocio\WPUtils
 */

namespace WPSocio\WPUtils;

/**
 * Provides the information about the plugin requirements.
 *
 * @package WPSocio\WPUtils
 * @author  WP Socio
 */
class Requirements {

	/**
	 * The environment details.
	 *
	 * @var array
	 */
	private $env_details = [];

	/**
	 * The path to main plugin file.
	 *
	 * @var string
	 */
	private $plugin_main_file;

	/**
	 * Constructor.
	 *
	 * @param string $plugin_main_file The path to main plugin file.
	 * @return void
	 */
	public function __construct( $plugin_main_file ) {
		$this->plugin_main_file = $plugin_main_file;

		$this->env_details = $this->read_env();
	}

	/**
	 * Check if the requirements are satisfied.
	 *
	 * @return bool Whether the requirements are satisfied.
	 */
	public function satisfied() {
		return $this->env_details['satisfied'];
	}

	/**
	 * Get the environment details.
	 */
	public function get_env_details() {
		return $this->env_details;
	}

	/**
	 * Sets the environment details.
	 *
	 * @return $this
	 */
	public function read_env() {
		if ( ! function_exists( 'get_plugin_data' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		$plugin_data = get_plugin_data( $this->plugin_main_file );

		$data = [
			'PHP' => [
				'version' => PHP_VERSION,
				'min'     => isset( $plugin_data['RequiresPHP'] ) ? $plugin_data['RequiresPHP'] : '7.0',
			],
			'WP'  => [
				'version' => get_bloginfo( 'version' ),
				'min'     => isset( $plugin_data['RequiresWP'] ) ? $plugin_data['RequiresWP'] : '5.3',
			],
		];

		$satisfied = true;

		foreach ( $data as &$details ) {
			$details['satisfied'] = version_compare( $details['version'], $details['min'], '>=' );

			if ( $satisfied && ! $details['satisfied'] ) {
				$satisfied = false;
			}
		}

		return compact( 'data', 'satisfied' );
	}
}
