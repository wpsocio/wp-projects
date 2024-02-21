### Examples for [`wptelegram_login_update_user_data`](../README.md#wptelegram_login_update_user_data) filter.

```php
// Avoid updating first and last name from Telegram
add_filter( 'wptelegram_login_update_user_data', function ( $userdata ) {
    unset( $userdata['first_name'], $userdata['last_name'] );

    return $userdata;
} );
```
