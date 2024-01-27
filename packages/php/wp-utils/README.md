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

### `WPSocio\WPUtils\ViteWPReactAssets`

Manage the assets for a React app built with Vite using [`@wpsocio/vite-wp-react`](https://www.npmjs.com/package/@wpsocio/vite-wp-react) npm package.

```php

$assets_dir = untrailingslashit( plugin_dir_path( __FILE__ ) ) . '/assets/build';
$assets_url = untrailingslashit( plugins_url( '', __FILE__ ) ) . '/assets/build';

$assets = new \WPSocio\WPUtils\ViteWPReactAssets( $assets_dir, $assets_url );

$entry = 'js/settings/index.tsx';

$assets->enqueue(
    $entry,
    [
        'handle'              => 'some-js-handle',
        'script-dependencies' => [ 'wp-element', 'wp-i18n' ],
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

## Requirements

- `PHP >= 8.0`
- `WP >= 6.4`
