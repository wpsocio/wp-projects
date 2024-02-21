### Examples for [`wptelegram_login_after_user_login`](../README.md#wptelegram_login_after_user_login) filter.

```php
/* WP Telegram Login | Auto verify users for BuddyPress */
add_action(
	'wptelegram_login_after_user_login',
	function ( $user_id ) {
		// Make sure that "Verified Member for BuddyPress" plugin is active.
		if ( class_exists( 'BP_Verified_Member' ) ) {
			global $bp_verified_member_admin;

			$display_badge = $bp_verified_member_admin->settings->get_option( 'display_badge_in_profile_username' );

			$meta_key = $bp_verified_member_admin->meta_box->meta_keys['verified'];

			if ( ! empty( $display_badge ) && empty( get_user_meta( $user_id, $meta_key, true ) ) ) {
				update_user_meta( $user_id, $meta_key, true );
			}
		}
	},
	10,
	1
);
```
