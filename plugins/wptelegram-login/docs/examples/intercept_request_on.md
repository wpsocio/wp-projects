### Examples for [`wptelegram_login_intercept_request_on`](../README.md#wptelegram_login_intercept_request_on) filter.

```php
// Use 'parse_query' action to intercept the request.
add_filter( 'wptelegram_login_intercept_request_on', function () {
    return [ 'parse_query', 10 ];
} );
```
