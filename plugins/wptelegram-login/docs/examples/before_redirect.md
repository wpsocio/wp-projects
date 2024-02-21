### Examples for [`wptelegram_login_before_redirect`](../README.md#wptelegram_login_before_redirect) filter.

```php
// WP Telegram Login | Custom redirect for different user roles
add_action( 'wptelegram_login_before_redirect', function () {
    $redirect_to =  '/my-account/';

    if ( current_user_can( 'seller' ) ) {
        $redirect_to =  '/vendor-dashboard/';
    }

    wp_safe_redirect( $redirect_to );

    exit();
} );
```
