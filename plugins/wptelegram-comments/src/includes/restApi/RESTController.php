<?php
/**
 * WP REST API functionality of the plugin.
 *
 * @link       https://wpsocio.com
 * @since      1.1.0
 *
 * @package    WPTelegram\Comments
 * @subpackage WPTelegram\Comments\includes
 */

namespace WPTelegram\Comments\includes\restApi;

/**
 * Base class for all the endpoints.
 *
 * @since 1.1.0
 *
 * @package    WPTelegram\Comments
 * @subpackage WPTelegram\Comments\includes
 * @author     WP Socio
 */
abstract class RESTController extends \WP_REST_Controller {

	/**
	 * The namespace of this controller's route.
	 *
	 * @var string
	 * @since 1.1.0
	 */
	const NAMESPACE = 'wptelegram-comments/v1';

	/**
	 * The base of this controller's route.
	 *
	 * @var string
	 */
	const REST_BASE = '';
}
