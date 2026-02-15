<?php
/**
 * Helper for PostSender integration tests.
 *
 * Provides singleton resets, options setup, and Telegram API mocking.
 *
 * @package WPTelegram\Core\Tests
 *
 * @phpcs:disable Squiz.Commenting.FunctionComment
 */

namespace WPTelegram\Core\Tests\Helpers;

use ReflectionClass;
use WPTelegram\Core\modules\BaseClass as ModulesBaseClass;
use WPTelegram\Core\modules\BaseModule;
use WPTelegram\Core\modules\p2tg\Admin;
use WPTelegram\Core\modules\p2tg\PostSender;
use WPTelegram\Core\modules\p2tg\RequestCheck;

/**
 * Class PostSenderHelper
 *
 * @package WPTelegram\Core\Tests\Helpers
 */
class PostSenderHelper {

	/**
	 * Intercepted Telegram API requests.
	 *
	 * @var array
	 */
	private static $intercepted = [];

	/**
	 * The pre_http_request filter callback reference.
	 *
	 * @var callable|null
	 */
	private static $http_filter = null;

	// ─── Singleton resets ────────────────────────────────

	/**
	 * Reset all static state that persists between tests.
	 */
	public static function reset_all(): void {
		UpgradeHelper::reset_all();
		self::reset_module_instances();
		self::reset_processed_posts();
		self::reset_request_check();
		self::reset_admin_saved_options();
	}

	/**
	 * Clear modules\BaseClass::$instances (PostSender, Admin, etc.)
	 * and BaseModule::$instances + $initiated (p2tg\Main, etc.).
	 */
	public static function reset_module_instances(): void {
		// modules\BaseClass::$instances — holds PostSender, Admin, etc.
		$class     = new ReflectionClass( ModulesBaseClass::class );
		$instances = $class->getProperty( 'instances' );
		$instances->setValue( null, [] );

		// modules\BaseModule::$instances — holds p2tg\Main, etc.
		$class     = new ReflectionClass( BaseModule::class );
		$instances = $class->getProperty( 'instances' );
		$instances->setValue( null, [] );

		$initiated = $class->getProperty( 'initiated' );
		$initiated->setValue( null, [] );
	}

	/**
	 * Clear PostSender::$processed_posts so the same post can be re-sent.
	 */
	public static function reset_processed_posts(): void {
		$class = new ReflectionClass( PostSender::class );
		$prop  = $class->getProperty( 'processed_posts' );
		$prop->setValue( null, [] );
	}

	/**
	 * Clear RequestCheck::$is_post_request so it re-evaluates $_SERVER.
	 */
	public static function reset_request_check(): void {
		$class = new ReflectionClass( RequestCheck::class );
		$prop  = $class->getProperty( 'is_post_request' );
		$prop->setValue( null, null );
	}

	/**
	 * Clear Admin::$saved_options.
	 */
	public static function reset_admin_saved_options(): void {
		$class = new ReflectionClass( Admin::class );
		$prop  = $class->getProperty( 'saved_options' );
		$prop->setValue( null, null );
	}

	// ─── Plugin options setup ────────────────────────────

	/**
	 * Get default p2tg options for testing.
	 *
	 * @param array $overrides Values to merge into defaults.
	 * @return array
	 */
	public static function get_default_p2tg_options( array $overrides = [] ): array {
		$defaults = [
			'active'                  => true,
			'channels'                => [ '@test_channel' ],
			'send_when'               => [ 'new', 'existing' ],
			'post_types'              => [ 'post' ],
			'rules'                   => [],
			'message_template'        => '{post_title}',
			'excerpt_source'          => 'post_content',
			'excerpt_length'          => 55,
			'excerpt_preserve_eol'    => false,
			'send_featured_image'     => false,
			'image_position'          => 'before',
			'single_message'          => false,
			'cats_as_tags'            => false,
			'parse_mode'              => 'none',
			'link_preview_disabled'   => false,
			'link_preview_url'        => '',
			'link_preview_above_text' => false,
			'inline_url_button'       => false,
			'inline_button_text'      => '',
			'inline_button_url'       => '',
			'plugin_posts'            => true,
			'post_edit_switch'        => false,
			'delay'                   => 0,
			'disable_notification'    => false,
			'protect_content'         => false,
		];

		return array_merge( $defaults, $overrides );
	}

	/**
	 * Set the full plugin options in the database.
	 *
	 * @param array $p2tg_overrides  Overrides for p2tg options.
	 * @param array $root_overrides  Overrides for root-level options (bot_token, etc.).
	 */
	public static function setup_options( array $p2tg_overrides = [], array $root_overrides = [] ): void {
		$defaults = [
			'bot_token' => '123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11',
			'p2tg'      => self::get_default_p2tg_options( $p2tg_overrides ),
		];

		$options = array_merge( $defaults, $root_overrides );

		update_option( 'wptelegram', wp_json_encode( $options ) );
	}

	// ─── Telegram API mocking ────────────────────────────

	/**
	 * Mock the Telegram API by intercepting HTTP requests to api.telegram.org.
	 *
	 * @param array $response_override Override parts of the mock response body.
	 */
	public static function mock_telegram_api( array $response_override = [] ): void {
		self::$intercepted = [];

		$body = array_merge(
			[
				'ok'     => true,
				'result' => [ 'message_id' => 123 ],
			],
			$response_override
		);

		self::$http_filter = function ( $preempt, $args, $url ) use ( $body ) {
			if ( str_contains( $url, 'api.telegram.org' ) ) {
				self::$intercepted[] = [
					'url'  => $url,
					'args' => $args,
				];
				return [
					'response' => [
						'code'    => 200,
						'message' => 'OK',
					],
					'body'     => wp_json_encode( $body ),
					'headers'  => [],
					'cookies'  => [],
				];
			}
			return $preempt;
		};

		add_filter( 'pre_http_request', self::$http_filter, 10, 3 );
	}

	/**
	 * Mock the Telegram API to return a WP_Error.
	 *
	 * @param string $message Error message.
	 */
	public static function mock_telegram_api_error( string $message = 'Connection failed' ): void {
		self::$intercepted = [];

		self::$http_filter = function ( $preempt, $args, $url ) use ( $message ) {
			if ( str_contains( $url, 'api.telegram.org' ) ) {
				self::$intercepted[] = [
					'url'  => $url,
					'args' => $args,
				];
				return new \WP_Error( 'http_request_failed', $message );
			}
			return $preempt;
		};

		add_filter( 'pre_http_request', self::$http_filter, 10, 3 );
	}

	/**
	 * Get all intercepted Telegram API requests.
	 *
	 * @return array Each entry has 'url' and 'args' keys.
	 */
	public static function get_intercepted_requests(): array {
		return self::$intercepted;
	}

	/**
	 * Remove the Telegram API mock and clear captured requests.
	 */
	public static function clear_telegram_api_mock(): void {
		if ( self::$http_filter ) {
			remove_filter( 'pre_http_request', self::$http_filter, 10 );
			self::$http_filter = null;
		}
		self::$intercepted = [];
	}

	// ─── Test fixtures ───────────────────────────────────

	/**
	 * Create and log in a user with editor role.
	 *
	 * @return int The user ID.
	 */
	public static function setup_editor_user(): int {
		$user_id = wp_insert_user(
			[
				'user_login' => 'test_editor_' . wp_rand(),
				'user_pass'  => 'password',
				'role'       => 'editor',
			]
		);

		wp_set_current_user( $user_id );

		return $user_id;
	}

	/**
	 * Create and log in a user with subscriber role.
	 *
	 * @return int The user ID.
	 */
	public static function setup_subscriber_user(): int {
		$user_id = wp_insert_user(
			[
				'user_login' => 'test_subscriber_' . wp_rand(),
				'user_pass'  => 'password',
				'role'       => 'subscriber',
			]
		);

		wp_set_current_user( $user_id );

		return $user_id;
	}

	// ─── Assertion helpers ───────────────────────────────

	/**
	 * Extract the API method name from an intercepted request URL.
	 * E.g., "https://api.telegram.org/bot.../sendMessage" → "sendMessage"
	 *
	 * @param string $url The full API URL.
	 * @return string The method name.
	 */
	public static function get_api_method_from_url( string $url ): string {
		$path = wp_parse_url( $url, PHP_URL_PATH );
		return basename( $path );
	}

	/**
	 * Get the request body from an intercepted request.
	 *
	 * @param array $request An intercepted request entry.
	 * @return array The request body parameters.
	 */
	public static function get_request_body( array $request ): array {
		return $request['args']['body'] ?? [];
	}
}
