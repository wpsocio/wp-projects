<?php
/**
 * Autoloader.
 *
 * @package WPTelegram\BotAPI
 */

spl_autoload_register( 'wptelegram_bot_api_autoload' );

/**
 * Autoloads files with WPTelegram\BotAPI classes when needed
 *
 * @param  string $className Name of the class being requested.
 */
function wptelegram_bot_api_autoload( $className ) {
	$namespace = 'WPTelegram\BotAPI';

	if ( 0 !== strpos( $className, $namespace ) ) {
		return;
	}

	$className = str_replace( $namespace, '', $className );
	$className = str_replace( '\\', DIRECTORY_SEPARATOR, $className );

	$path = __DIR__ . DIRECTORY_SEPARATOR . 'src' . $className . '.php';

	include_once $path;
}
