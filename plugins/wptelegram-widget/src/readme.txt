=== WP Telegram Widget and Join Link ===
Contributors: wpsocio, irshadahmad21
Donate link: https://wpsocio.com/donate
Tags: telegram, feed, widget, channel, group
Requires at least: 6.2
Requires PHP: 7.4
Tested up to: 6.4.1
Stable tag: 2.1.15
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Display the Telegram Public Channel or Group Feed in a WordPress widget or anywhere you want using a simple shortcode.

== Description ==
Display the Telegram Public Channel or Group Feed in a WordPress widget or anywhere you want using a simple shortcode.

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

== Excellent Support ==

= Join the Chat =

We have a public group on Telegram to provide help setting up the plugin, discuss issues, features, translations etc. Join [@WPTelegramChat](https://t.me/WPTelegramChat)
For rules, see the pinned message. No spam please.

= Get in touch =

*	Website [wpsocio.com](https://wpsocio.com)
*	Telegram [@WPTelegram](https://t.me/WPTelegram)
*	Facebook [@WPTelegram](https://fb.com/WPTelegram)
*	Twitter [@WPTelegram](https://twitter.com/WPTelegram)

== Contribution ==

Development occurs in our [Github monorepo](https://github.com/wpsocio/wp-projects), and all contributions welcome.

== Frequently Asked Questions ==

= How to create a Telegram Bot =

[How do I create a bot?](https://core.telegram.org/bots/faq#how-do-i-create-a-bot).

= Why Legacy Widget shows nothing? =

<em>Legacy Widget</em> <strong>does not show</strong> the <strong>old messages</strong>.

You need to post something new into the group/channel and wait for 5 minutes for the messages to appear.

If you are too impatient to wait for the results, open the URL under <strong>Tip!💡</strong> (below the instructions) in your browser.

<strong>Note:</strong> Please ensure to follow the instructions given on the settings page correctly.

= Why do I see my own website in the widget? =

It means that there is something wrong with the permalinks on your website.

Simply goto wp-admin > Settings > <strong>Permalinks</strong> and just <em>Save Changes.</em>

That should fix it. If it doesn't, please let us know at [@WPTelegramSupport](https://t.me/WPTelegramSupport).

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

== Installation ==

= Automatic installation =

Automatic installation is the easiest way -- WordPress will handle the file transfer, and you won’t need to leave your web browser. To do an automatic install of the plugin:
 
* Log in to your WordPress dashboard
* Navigate to the Plugins menu, and click "Add New"
* In the search field type "wptelegram-widget" and hit Enter
* Locate the plugin in the list of search results
* Click on "Install Now" and wait for the installation to complete
* Click on "Activate"

= Manual installation =

Manual installation method requires downloading the plugin and uploading it to your web server via your favorite FTP application. The official WordPress documentation contains [instructions on how to do this here](https://wordpress.org/support/article/managing-plugins/#manual-plugin-installation).

= Updating =

Automatic updates should work smoothly, but we still recommend you back up your site.

== Changelog ==

= 2.1.15 =
- Fixed PHP notice on plugins page requirements

[See full changelog](https://github.com/wpsocio/wptelegram-widget/blob/main/CHANGELOG.md)
