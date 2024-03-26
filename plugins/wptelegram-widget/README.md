# WP Telegram Widget and Join Link

**Contributors:** [wpsocio](https://github.com/wpsocio), [irshadahmad21](https://github.com/irshadahmad21)  
**Tags:** telegram, feed, widget, channel, group  
**Requires at least:** 6.4  
**Requires PHP:** 7.4  
**Tested up to:** 6.5  
**Stable tag:** 2.1.21  
**License:** GPL-3.0-or-later  
**License URI:** [https://www.gnu.org/licenses/gpl-3.0.html](https://www.gnu.org/licenses/gpl-3.0.html)  
**Donate link:** [wpsocio.com/donate](https://wpsocio.com/donate)

[![Wordpress plugin](https://img.shields.io/wordpress/plugin/v/wptelegram-widget.svg)](https://wordpress.org/plugins/wptelegram-widget/)
[![Wordpress](https://img.shields.io/wordpress/plugin/dt/wptelegram-widget.svg)](https://wordpress.org/plugins/wptelegram-widget/)
[![Wordpress rating](https://img.shields.io/wordpress/plugin/r/wptelegram-widget.svg)](https://wordpress.org/plugins/wptelegram-widget/)

Complete contributors list found here: [github.com/wpsocio/wptelegram-widget/graphs/contributors](https://github.com/wpsocio/wptelegram-widget/graphs/contributors)

**[Download plugin on wordpress.org](https://wordpress.org/plugins/wptelegram-widget/)**

## Description

Display the Telegram Public Channel or Group Feed in a WordPress widget or anywhere you want using a shortcode.

## Features:

- Provides an ajax widget to display channel feed
- Ajax widget contains a Join Channel link
- A separate Join Channel Link/Button
- Pulls updates automatically from Telegram
- Uses a responsive widget to display the feed
- Fits anywhere you want it to be
- The received messages can be seen from `/wp-admin`
- Automatically removes deleted messages
- Can be displayed using a shortcode
- Available as a Gutengerg block
- Allows embedding of Telegram public channel messages
- Can be extended with custom code

## Widget Info

### Ajax Widget

Goto **Appearance** > **Widgets** and click/drag **WP Telegram Ajax Widget** and place it where you want it to be.

Alternately, you can use the below shortcode.

Inside page or post content:

`[wptelegram-ajax-widget username="WPTelegram" width="100%" height="500px"]`

Inside the theme templates

```php
<?php
if ( function_exists( 'wptelegram_ajax_widget' ) ) {
    wptelegram_ajax_widget();
}
?>
```

or

```php
<?php echo do_shortcode( '[wptelegram-ajax-widget width="98%" height="700px"]' ); ?>
```

### Legacy Widget

Goto **Appearance** > **Widgets** and click/drag **WP Telegram Legacy Widget** and place it where you want it to be.

Alternately, you can use the below shortcode.

Inside page or post content:

`[wptelegram-widget num_messages="5" width="100%" author_photo="auto"]`

Inside the theme templates

```php
<?php
if ( function_exists( 'wptelegram_widget' ) ) {
    $args = array(
        // 'author_photo' => 'auto',
        // 'num_messages' => 5,
        // 'width'        => 100,
    );

    wptelegram_widget( $args );
}
?>
```

or

```php
<?php echo do_shortcode( '[wptelegram-widget num_messages="5" width="100%" author_photo="always_show"]' ); ?>
```

### Join Link

Goto **Appearance** > **Widgets** and click/drag **WP Telegram Join Channel** and place it where you want it to be.

Alternately, you can use the below shortcode.

Inside page or post content:

`[wptelegram-join-channel link="https://t.me/WPTelegram" text="Join @WPTelegram on Telegram"]`

Inside the theme templates

```php
<?php
if ( function_exists( 'wptelegram_join_channel' ) ) {
    $args = array(
        'link' => 'https://t.me/WPTelegram',
		'text' => 'Join @WPTelegram on Telegram',
    );
    wptelegram_join_channel( $args );
}
?>
```

or

```php
<?php echo do_shortcode( '[wptelegram-join-channel link="https://t.me/WPTelegram" text="Join us on Telegram"]' ); ?>
```

### Contribution

Development takes place in our [Github monorepo](https://github.com/wpsocio/wp-projects), and all contributions welcome.

## Translation

If you want to help with translation of the plugin, you can contribute via [WordPress Plugin Translations](https://translate.wordpress.org/projects/wp-plugins/wptelegram-widget).

## Installation

#### Automatic installation

Automatic installation is the easiest way -- WordPress will handle the file transfer, and you won’t need to leave your web browser. To do an automatic install of the plugin:

- Log in to your WordPress dashboard
- Navigate to the Plugins menu, and click "Add New"
- In the search field type "wptelegram-widget" and hit Enter
- Locate the plugin in the list of search results
- Click on "Install Now" and wait for the installation to complete
- Click on "Activate"

#### Manual installation

Manual installation method requires downloading the plugin and uploading it to your web server via your favorite FTP application. The official WordPress documentation contains [instructions on how to do this here](https://wordpress.org/support/article/managing-plugins/#manual-plugin-installation).

#### Updating

Automatic updates should work smoothly, but we still recommend you back up your site.
