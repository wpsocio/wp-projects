<?php
/**
 * PHPUnit bootstrap file.
 *
 * Loads the WordPress test framework from wp-env and then the plugin.
 *
 * @package WPTelegram
 */

$_tests_dir = getenv( 'WP_TESTS_DIR' );

if ( ! $_tests_dir ) {
	$_tests_dir = '/wordpress-phpunit';
}

// Point the WP test framework to the polyfills installed via Composer.
define( 'WP_TESTS_PHPUNIT_POLYFILLS_PATH', dirname( __DIR__ ) . '/vendor/yoast/phpunit-polyfills' );

require_once $_tests_dir . '/includes/functions.php';

/**
 * Load the plugin before WordPress finishes bootstrapping.
 *
 * Pre-set the version option so do_upgrade() returns early during init.
 * This prevents WPTELEGRAM_DOING_UPGRADE from being defined in bootstrap,
 * allowing tests to control when and whether upgrades run.
 */
// Use dev.php as WPTELEGRAM_MAIN_FILE so that
// dirname(WPTELEGRAM_MAIN_FILE) . '/vendor/autoload.php' resolves to
// the dev vendor directory instead of the production src/vendor/ path.
define( 'WPTELEGRAM_MAIN_FILE', dirname( __DIR__ ) . '/dev.php' );
define( 'WPTELEGRAM_BASENAME', 'wptelegram/dev.php' );

tests_add_filter(
	'muplugins_loaded',
	function () {
		update_option( 'wptelegram_ver', '999.0.0' );

		require dirname( __DIR__ ) . '/src/wptelegram.php';
	}
);

require $_tests_dir . '/includes/bootstrap.php';
