<?php
/**
 * Auto-prepend file for PHPUnit.
 *
 * Runs before Composer's autoloader to prepare the environment.
 *
 * 1. Defines ABSPATH to prevent WordPress-dependent autoload files
 *    (e.g., wptelegram-bot-api/init.php) from calling die().
 * 2. Loads wp-includes/plugin.php so add_action() is available.
 *
 * @package WPTelegram
 */

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', '/var/www/html/' );
}

// Load the WordPress plugin API early so autoloaded files can use add_action() etc.
require_once ABSPATH . 'wp-includes/plugin.php';
