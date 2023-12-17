<?php
/**
 * Release script.
 *
 * @package wptelegram-bot-api
 */

if ( file_exists( __DIR__ . '/../vendor/autoload.php' ) ) {
	require_once __DIR__ . '/../vendor/autoload.php';
}

use z4kn4fein\SemVer\Version;
use z4kn4fein\SemVer\Inc;

$options = getopt( '', [ 'type::', 'file::' ] );

$version_map = [
	'major' => Inc::MAJOR,
	'minor' => Inc::MINOR,
	'patch' => Inc::PATCH,
];

$ver_type = 'patch';

if ( isset( $options['type'] ) && array_key_exists( $options['type'], $version_map ) ) {

	$ver_type = $options['type'];

	echo sprintf( 'Doing a %s version bump...', $ver_type ) . PHP_EOL;
} else {
	echo 'Falling back to a patch version bump...' . PHP_EOL;
}

$file = isset( $options['file'] ) ? $options['file'] : 'autoload-wp.php';

$file = str_replace( '\\', DIRECTORY_SEPARATOR, $file );

$file_path = realpath( getcwd() . DIRECTORY_SEPARATOR . $file );

if ( ! file_exists( $file_path ) ) {
	echo sprintf( 'File "%s" not found!', $file_path ) . PHP_EOL;
	exit( 1 );
}

// Read the file.
$contents = file_get_contents( $file_path );

$ver_pattern = '/(?<=const\sVERSION\s=\s\')[0-9]+\.[0-9]+\.[0-9]+(?=\';)/';
$pri_pattern = '/(?<=const\sPRIORITY\s=\s)[0-9]+(?=;)/';

if ( ! preg_match( $ver_pattern, $contents, $match ) ) {
	echo sprintf( 'Could not find a version string in file "%s"!', $file_path ) . PHP_EOL;
	exit( 1 );
}

if ( ! preg_match( $pri_pattern, $contents, $match ) ) {
	echo sprintf( 'Could not find a priority string in file "%s"!', $file_path ) . PHP_EOL;
	exit( 1 );
}

$cur_priority = (int) $match[0];
// Decrement the priority.
$new_priority = $cur_priority - 1;
// Replace the priority string.
$contents = preg_replace( $pri_pattern, $new_priority, $contents );

// Parse the version string.
$version     = Version::parse( $cur_version );
$cur_version = $match[0];
// Increment the version.
$new_version = (string) $version->inc( $version_map[ $ver_type ] );
// Replace the version string.
$contents = preg_replace( $ver_pattern, $new_version, $contents );
// Normalize the version string.
$normalized_cur_version = str_replace( [ '.', '+', '-' ], '_', $cur_version );
$normalized_new_version = str_replace( [ '.', '+', '-' ], '_', $new_version );
// Replace the version string in the class name.
$contents = str_replace( $normalized_cur_version, $normalized_new_version, $contents );

// Write the file.
file_put_contents( $file_path, $contents );
