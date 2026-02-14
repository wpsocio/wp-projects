<?php
/**
 * Helper for resetting singletons between tests.
 *
 * @package WPTelegram\Tests
 */

namespace WPTelegram\Tests\Helpers;

use ReflectionClass;
use WPTelegram\Core\includes\BaseClass;
use WPTelegram\Core\includes\Main;

/**
 * Uses Reflection to reset singleton state so each test gets a fresh instance.
 */
class UpgradeHelper {

	/**
	 * Reset Main::$instance and Main::$initiated.
	 */
	public static function reset_main(): void {
		$class = new ReflectionClass( Main::class );

		$instance = $class->getProperty( 'instance' );
		$instance->setValue( null, null );

		$initiated = $class->getProperty( 'initiated' );
		$initiated->setValue( null, false );
	}

	/**
	 * Reset BaseClass::$instances to clear all subclass singletons (Upgrade, Admin, etc.).
	 */
	public static function reset_base_class_instances(): void {
		$class = new ReflectionClass( BaseClass::class );

		$instances = $class->getProperty( 'instances' );
		$instances->setValue( null, [] );
	}

	/**
	 * Reset all singletons.
	 */
	public static function reset_all(): void {
		self::reset_main();
		self::reset_base_class_instances();
	}
}
