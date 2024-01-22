# WP Telegram Widget and Join Link

**Contributors:** [wpsocio](https://github.com/wpsocio), [irshadahmad21](https://github.com/irshadahmad21)  
**Tags:** telegram, feed, widget, channel, group  
**Requires at least:** 6.1  
**Requires PHP:** 7.4  
**Tested up to:** 6.4.2  
**Stable tag:** 2.1.11  
**License:** GPLv2 or later  
**License URI:** [http://www.gnu.org/licenses/gpl-2.0.html](http://www.gnu.org/licenses/gpl-2.0.html)  
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
- Allows embeding of Telegram public channel messages
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

Development occurs on Github, and all contributions welcome.

## Translation

If you are looking to provide language translation files, Please do so via [WordPress Plugin Translations](https://translate.wordpress.org/projects/wp-plugins/wptelegram-widget).

## Installation

1. Upload the `wptelegram-widget` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the Plugins menu in WordPress. After activation, you should see the menu of this plugin the the admin
3. Configure the plugin.
