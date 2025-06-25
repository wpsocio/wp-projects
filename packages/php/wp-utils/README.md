# WPSocio WPUtils

Utilities for WordPress plugins and themes.

## Usage

```bash
composer require wpsocio/wp-utils
```

```php
require_once __DIR__ . '/autoload.php';
```

### `WPSocio\WPUtils\Options`

Allows an easy access to plugin or theme options/settings which are in the form of an array, no matter how deep it is.

```php
$option_key    = 'option_name_here';
$store_as_json = false

$options = new \WPSocio\WPUtils\Options( $option_key, $store_as_json );

$options->get( 'some_key' ); // false
$options->get( 'some_key', 'default_value' ); // 'default_value'

$options->set( 'some_key', 'some_value' );
$options->get( 'some_key' ); // 'some_value'

// Updates the value in the database if $option_key is provided
$options->set_data( [
    'first' => 'some_value',
    'second' => [
        'a1' => 'a1-value',
        'a2' => 'a2-value',
    ],
] );

$options->get_path( 'second.a2' ); // 'a2-value'

```

### `WPSocio\WPUtils\Requirements`

Checks if the environment meets the requirements.

```php
$plugin_file = '/path/to/plugin/file.php';

$requirements = new \WPSocio\WPUtils\Requirements( $plugin_file );

if ( $requirements->satisfied() ) {
    // Do something
}

$details = $requirements->get_env_details();

/*
[
    'data' => [
        'PHP' => [
            'version' => '8.0.0',
            'min'     => '7.0',
        ],
        'WP'  => [
            'version' => '5.3',
            'min'     => '5.3',
        ],
    ],
    'satisfied' => true,
]
*/
```

### `WPSocio\WPUtils\JsDependencies`

Manage JavaScript dependencies for WordPress plugin builds .

```php
<?php
// Path to the build directory containing the depdencies manifest files
$build_dir = plugin_dir_path( __FILE__ ) . '/assets';

// Create an instance of JsDependencies
$dependencies = new \WPSocio\WPUtils\JsDependencies( $build_dir );

// Get dependencies for a specific entry point
$entry_point = 'js/settings/index.ts';
$script_dependencies = $dependencies->get( $entry_point );

// Use dependencies when registering scripts
wp_register_script(
    'my-plugin-script',
    plugin_dir_url( __FILE__ ) . '/assets/build/' . $entry_point,
    $script_dependencies,
    '1.0.0',
    true
);
```

### `WPSocio\WPUtils\ViteWPReactAssets`

Manage the assets for a React app built with Vite using [`@wpsocio/vite-wp-react`](https://www.npmjs.com/package/@wpsocio/vite-wp-react) npm package.

```php

$build_dir = plugin_dir_path( __FILE__ ) . '/assets';
$assets_dir = untrailingslashit( plugin_dir_path( __FILE__ ) ) . '/assets/build';
$assets_url = untrailingslashit( plugins_url( '', __FILE__ ) ) . '/assets/build';

$assets = new \WPSocio\WPUtils\ViteWPReactAssets( $assets_dir, $assets_url );
$dependencies = new \WPSocio\WPUtils\JsDependencies( $build_dir );

$entry = 'js/settings/index.tsx';

$assets->enqueue(
    $entry,
    [
        'handle'              => 'some-js-handle',
        'script-dependencies' => $dependencies->get( $entry ),
        'style-dependencies'  => ['wp-components'],
    ]
);

// OR

[ $script_handle, $style_handles ] = $assets->register(
    $entry,
    [
        'handle'              => 'some-js-handle',
        'script-dependencies' => [ 'wp-element', 'wp-i18n' ],
        'style-dependencies'  => ['wp-components'],
    ]
);

// Later on
$assets->enqueue( $entry );
// or
wp_enqueue_script( $script_handle );
foreach ( $style_handles as $style_handle ) {
    wp_enqueue_style( $style_handle );
}

```

### `WPSocio\WPUtils\IframedWPAdmin`

Easily create iframed admin pages for your WordPress plugins/themes to avoid wp-admin style conflicts. You can easily use Tailwind CSS or any other CSS framework without worrying about conflicts with the WordPress admin styles.

```php
<?php
// Set up paths for the package
$package_dir_path = plugin_dir_path( __FILE__ ) . '/vendor/wpsocio/wp-utils';
$package_dir_url = plugin_dir_url( __FILE__ ) . '/vendor/wpsocio/wp-utils';

// Create an instance of IframedWPAdmin
$iframed_admin = new \WPSocio\WPUtils\IframedWPAdmin( $package_dir_path, $package_dir_url );

// Register assets (typically in a hook like admin_init)
$iframed_admin->register_assets();

// Enqueue assets when needed in admin_enqueue_scripts, providing the entry point and options
$iframed_admin->enqueue_assets(
    'js/settings/index.ts',
    [
        'props' => [
            'title' => 'Settings',
        ],
    ]
);

// In your admin page callback, render the root element
function my_admin_page_callback() {

    // Render the iframe container
    $iframed_admin->render_root();
}
```

Then you can enqueue the assets for the iframe using the `wpsocio_iframed_wp_admin_enqueue_assets` hook

```php
add_action( 'wpsocio_iframed_wp_admin_enqueue_assets', function ( $entry_point ) {
    $assets = new \WPSocio\WPUtils\ViteWPReactAssets( $assets_dir, $assets_url );

    $assets->enqueue( $entry_point );

}, 10, 1 );

## Requirements

- `PHP >= 8.0`
- `WP >= 6.4`
```
