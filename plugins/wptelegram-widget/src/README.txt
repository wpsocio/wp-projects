=== WP Telegram Widget and Join Link ===
Contributors: wpsocio, irshadahmad21
Donate link: https://wpsocio.com/donate
Tags: telegram, feed, widget, channel, group
Requires at least: 6.1
Requires PHP: 7.4
Tested up to: 6.4.2
Stable tag: 2.1.11
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Display the Telegram Public Channel or Group Feed in a WordPress widget or anywhere you want using a simple shortcode.

== Description ==
Display the Telegram Public Channel or Group Feed in a WordPress widget or anywhere you want using a simple shortcode.

== Excellent Support ==

**Join the Chat**

We have a public group on Telegram to provide help setting up the plugin, discuss issues, features, translations etc. Join [@WPTelegramChat](https://t.me/WPTelegramChat)
For rules, see the pinned message. No spam please.

== Features ==

*	Provides an ajax widget to display channel feed
*	Ajax widget contains a Join Channel link
*	A separate Join Channel Link/Button
*	Pulls updates automatically from Telegram
*	Uses a responsive widget to display the feed
*	Fits anywhere you want it to be
*	The received messages can be seen from /wp-admin
*	Automatically removes deleted messages
*	Can be displayed using a shortcode
*	Available as a Gutengerg block
*	Allows embeding of Telegram public channel messages
*	Can be extended with custom code

## Widget Info

**Ajax Widget**
Goto **Appearance** > **Widgets** and click/drag **WP Telegram Ajax Widget** and place it where you want it to be.

Alternately, you can use the below shortcode.

Inside page or post content:

`[wptelegram-ajax-widget username="WPTelegram" width="100%" height="500px"]`

Inside the theme templates
~~~
<?php
if ( function_exists( 'wptelegram_ajax_widget' ) ) {
    wptelegram_ajax_widget();
}
?>
~~~
or

~~~
<?php
    echo do_shortcode( '[wptelegram-ajax-widget width="98%" height="700px"]' );
?>
~~~

**Legacy Widget**
Goto **Appearance** > **Widgets** and click/drag **WP Telegram Legacy  Widget** and place it where you want it to be.

Alternately, you can use the below shortcode.

Inside page or post content:

`[wptelegram-widget num_messages="5" width="100%" author_photo="auto"]`

Inside the theme templates
~~~
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
~~~
or

~~~
<?php
    echo do_shortcode( '[wptelegram-widget num_messages="5" width="100%" author_photo="always_show"]' );
?>
~~~

**Join Link**
Goto **Appearance** > **Widgets** and click/drag **WP Telegram Join Channel** and place it where you want it to be.

Alternately, you can use the below shortcode.

Inside page or post content:

`[wptelegram-join-channel link="https://t.me/WPTelegram" text="Join @WPTelegram on Telegram"]`

Inside the theme templates
~~~
<?php
if ( function_exists( 'wptelegram_join_channel' ) ) {
    $args = array(
        'link' => 'https://t.me/WPTelegram',
		'text' => 'Join @WPTelegram on Telegram',
    );
    wptelegram_join_channel( $args );
}
?>
~~~
or

~~~
<?php
    echo do_shortcode( '[wptelegram-join-channel link="https://t.me/WPTelegram" text="Join us on Telegram"]' );
?>
~~~

**Get in touch**

*	Website [wptelegram.com](https://wptelegram.com)
*	Telegram [@WPTelegram](https://t.me/WPTelegram)
*	Facebook [@WPTelegram](https://fb.com/WPTelegram)
*	Twitter [@WPTelegram](https://twitter.com/WPTelegram)

**Contribution**
Development occurs on [Github](https://github.com/wpsocio/wptelegram-widget), and all contributions welcome.

**Translations**

Many thanks to the translators for the great job!

* [Алексей Семёнов](https://profiles.wordpress.org/els7777) (Russian)
* [robertskiba](https://profiles.wordpress.org/robertskiba/) (German)

* Note: You can also contribute in translating this plugin into your local language. Join the Chat (above)


== Installation ==


1. Upload the `wptelegram-widget` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the Plugins menu in WordPress. After activation, you should see the menu of this plugin the the admin
3. Configure the plugin.

**Enjoy!**

== Frequently Asked Questions ==

= How to create a Telegram Bot =

[How do I create a bot?](https://core.telegram.org/bots/faq#how-do-i-create-a-bot).

= Why Legacy Widget shows nothing? =

Legacy Widget does not show the old messages. you need to post something new into the group/channel and wait for 5 minutes for the messages to appear. If you are too impatient to wait for the results 😄, then open the URL given under **Tip!** (below the instructions) in your browser.


== Screenshots ==

1. Ajax Widget Settings
2. Legacy Widget Settings
3. Legacy Widget Settings (Cont.)
4. Join Link Settings
5. Advancced Settings
6. Widget Settings (back-end)
7. Widget View (front-end)
8. Blocks
9. Join Link View

== Changelog ==

= 2.1.11 =
- Maintenance release

= 2.1.10 =
- Fixed translations not loaded for some strings

= 2.1.9 =
- Added caching for the widget content

= 2.1.8 =
- Fixed warnings in PHP 8.x

= 2.1.7 =
- Maintenance release

= 2.1.6 =
- Maintenance release

= 2.1.5 =
- Fixed PHP warning for `block_categories` deprecation

= 2.1.4 =
- Added lazy loading to iframes

= 2.1.3 =
- Added new tab option for join link

= 2.1.2 =
- Cleaned up the admin menu for single entry for WP Telegram

= 2.1.1 =
- Fixed the issue of settings not saved due to trailing slash redirects

= 2.1.0 =
- Added multi-channel support for Ajax Widget
- Fixed the ugly URLs filter for widgets

= 2.0.5 =
- Fixed the admin menu and settings page icon

= 2.0.4 =
- Minor UI fixes for Join Link color picker

= 2.0.3 =
- Fixed the last messed up update

= 2.0.2 =
- Added color options to Join Link settings

= 2.0.1 =
-   Fixed the issue with message order in legacy widget

= 2.0.0 =
-   Switched to PHP namespaces
-   Added support for separate ajax and legacy widgets
-   Refreshed and improved the UI
-   Improved names for hooks and shortcodes

== Upgrade Notice ==