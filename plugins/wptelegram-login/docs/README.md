# Hooks

- [Actions](#actions)
- [Filters](#filters)

## Actions

### `wptelegram_login_init`

*Fires before the login process starts.*


Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 43](../src/shared/LoginHandler.php#L43-L46)

### `wptelegram_login_pre_save_user_data`

*Fires before the user data is saved after validation.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$auth_data` | `array` | The authenticated user data.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 56](../src/shared/LoginHandler.php#L56-L61)

### `wptelegram_login_after_save_user_data`

*Fires after the user data is authenticated and saved.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$wp_user_id` | `int` | The WordPress user ID.
`$auth_data` | `array` | The authenticated user data.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 65](../src/shared/LoginHandler.php#L65-L71)

### `wptelegram_login_before_user_login`

*Fires before the user is logged in after the data is authenticated and saved.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$wp_user_id` | `int` | The WordPress user ID.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 82](../src/shared/LoginHandler.php#L82-L87)

### `wptelegram_login_after_user_login`

*Fires after the user is successfully logged in.*

- [Examples](./examples/after_user_login.md)

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$wp_user_id` | `int` | The WordPress user ID.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 94](../src/shared/LoginHandler.php#L94-L101)

### `wptelegram_login`

*Fires after the user has successfully logged in.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$user_login` | `string` | Username.
`$user` | `\WP_User` | WP_User object of the logged-in user.

**Changelog**

Version | Description
------- | -----------
`1.3.4` | 

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 116](../src/shared/LoginHandler.php#L116-L124)

### `wptelegram_login_before_redirect`

*Fires before the user is redirected after the login.*

- [Examples](./examples/before_redirect.md)

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$user` | `\WP_User` | The logged in user.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 133](../src/shared/LoginHandler.php#L133-L140)

### `wptelegram_login_after_insert_user`

*Fires after the user is successfully inserted into the database.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$wp_user_id` | `int` | The WordPress user ID.
`$userdata` | `array` | The user data.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 579](../src/shared/LoginHandler.php#L579-L585)

### `wptelegram_login_after_update_user`

*Fires after the user is successfully updated in the database.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$wp_user_id` | `int` | The WordPress user ID.
`$userdata` | `array` | The user data.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 615](../src/shared/LoginHandler.php#L615-L621)

### `wptelegram_login_after_update_user_meta`

*Fires after the user meta is updated.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$wp_user_id` | `int` | The WordPress user ID.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 635](../src/shared/LoginHandler.php#L635-L640)

## Filters

### `widget_title`

*Filters the widget title.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$title` | `string` | The widget title. Default 'Pages'.
`$instance` | `array` | Array of settings for the current widget.
`$this->id_base` |  | 

**Changelog**

Version | Description
------- | -----------
`1.0.0` | 

Source: [src/shared/widgets/Primary.php](../src/shared/widgets/Primary.php), [line 46](../src/shared/widgets/Primary.php#L46-L55)

### `wptelegram_login_redirect_to`

*Filters the redirect URL for the login button*

It can be used to fix the wrong URL in case the website is in subdirectory and the URL is invalid.

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$redirect_to` | `string` | The redirect URL.

**Changelog**

Version | Description
------- | -----------
`1.0.0` | 

Source: [src/shared/Shared.php](../src/shared/Shared.php), [line 125](../src/shared/Shared.php#L125-L134)

### `wptelegram_login_telegram_callback_url`

*Filters the callback URL for the login button*

It can be used to fix the wrong URL in case the website is in subdirectory and the URL is invalid.

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$callback_url` | `string` | The callback URL.

**Changelog**

Version | Description
------- | -----------
`1.0.0` | 

Source: [src/shared/Shared.php](../src/shared/Shared.php), [line 154](../src/shared/Shared.php#L154-L163)

### `wptelegram_login_show_if_user_connected`

*Filters whether to show the button if user is already connected.*

- [Examples](./examples/show_if_user_connected.md)

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$show_if_connected` | `bool` | Whether to show the button if user is already connected.
`$current_user_telegram_id` | `int` | The current user's Telegram ID.

Source: [src/shared/Shared.php](../src/shared/Shared.php), [line 218](../src/shared/Shared.php#L218-L226)

### `wptelegram_login_show_if_user_is`

*Filters when to show the login button*

Possible values:
"logged_out", "logged_in", "author", "subscriber" etc.

You can also pass a user role e.g "editor" or a comma separated list or an array of roles
to display the button for specific user roles

Passing an empty value will display the button
for both logged in and logged out users

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$show_if_user_is` | `string` | When to show the button.

**Changelog**

Version | Description
------- | -----------
`1.0.0` | 

Source: [src/shared/Shared.php](../src/shared/Shared.php), [line 232](../src/shared/Shared.php#L232-L248)

### `wptelegram_login_use_telegram_avatar`

*Filters whether to use the Telegram avatar.*

Pass `false` to disable the Telegram avatar.

- [Examples](./examples/use_telegram_avatar.md)

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$use_telegram_avatar` | `bool` | Whether to use the Telegram avatar.
`$url` | `string` | Avatar URL.
`$id_or_email` | `mixed` | user id or email.

Source: [src/shared/Shared.php](../src/shared/Shared.php), [line 307](../src/shared/Shared.php#L307-L318)

### `wptelegram_login_custom_avatar_url`

*Filters the custom avatar URL.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$avatar_url` | `string` | The custom avatar URL.
`$url` | `string` | Avatar URL.
`$id_or_email` | `mixed` | user id or email.

Source: [src/shared/Shared.php](../src/shared/Shared.php), [line 352](../src/shared/Shared.php#L352-L359)

### `wptelegram_login_validation_query_params`

*Filter the validation query parameters that the plugin uses.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$validation_query_params` | `array` | The validation query parameters.
`$input` | `array` | The input data.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 204](../src/shared/LoginHandler.php#L204-L210)

### `wptelegram_login_clean_input`

*Filter the cleaned input from the login request.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$clean_input` | `array` | The cleaned input.
`$input` | `array` | The input data.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 214](../src/shared/LoginHandler.php#L214-L220)

### `wptelegram_login_valid_auth_data`

*Filter the validated auth data.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$auth_data` | `array` | The valid auth data.
`$input_data` | `array` | The input data.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 264](../src/shared/LoginHandler.php#L264-L270)

### `wptelegram_login_hash_auth_data`

*Filter the generated hash for the incoming auth data.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$generated_hash` | `string` | The generated hash.
`$auth_data` | `array` | The auth data received.
`$secret_key` | `string` | The secret key.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 298](../src/shared/LoginHandler.php#L298-L305)

### `wptelegram_login_get_secret_key`

*Filter the secret key for the data source.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$secret_key` | `string` | The secret key.
`$data_source` | `string` | The data source.
`$bot_token` | `string` | The bot token.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 344](../src/shared/LoginHandler.php#L344-L351)

### `wptelegram_login_random_email_host`

*Filter the host for the random email.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$host` | `string` | The host for the random email.
`$user` | `\WP_User` | The current user.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 365](../src/shared/LoginHandler.php#L365-L371)

### `wptelegram_login_random_email_user`

*Filter the username for the random email.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$random_user` | `string` | The username for the random email.
`$user` | `\WP_User` | The current user.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 374](../src/shared/LoginHandler.php#L374-L380)

### `wptelegram_login_random_email`

*Filter the randomly generated email.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$random_email` | `string` | The random email.
`$user` | `\WP_User` | The current user.
`$random_user` | `string` | The username for the random email.
`$host` | `string` | The host for the random email.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 384](../src/shared/LoginHandler.php#L384-L392)

### `wptelegram_login_disable_signup`

*Filters whether to disable sign up via Telegram.*

It means that the user must first create an account and connect it to Telegram to be able to use Telegram Login.

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$disable_signup` | `bool` | Whether to disable sign up via Telegram.
`$data` | `array` | The user details.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 475](../src/shared/LoginHandler.php#L475-L483)

### `wptelegram_login_always_update_user_data`

*Whether to always update the existing user data.*

Pass `false` if you do not want to update user profile for existing users.

- [Examples](./examples/always_update_user_data.md)

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$always_update` | `bool` | Whether to always update the user data.
`$data` | `array` | The user details.
`$existing_user_id` | `int\|null` | Existing WP User ID.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 493](../src/shared/LoginHandler.php#L493-L504)

### `wptelegram_login_save_user_data`

*Filter the user data before saving the user in the database.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$data` | `array` | The user details.
`$wp_user_id` | `int\|null` | Existing WP User ID.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 527](../src/shared/LoginHandler.php#L527-L533)

### `wptelegram_login_unique_username`

*Filter the unique username before creating the user.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$unique_username` | `string` | The unique username.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 552](../src/shared/LoginHandler.php#L552-L557)

### `wptelegram_login_insert_user_data`

*Filter the user data before inserting the user into the database.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$userdata` | `array` | The user data.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 566](../src/shared/LoginHandler.php#L566-L571)

### `wptelegram_login_update_user_data`

*Filter the user data before updating the user in the database.*

- [Examples](./examples/update_user_data.md)

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$userdata` | `array` | The user data.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 595](../src/shared/LoginHandler.php#L595-L602)

### `wptelegram_login_user_redirect_to`

*Filter the redirect URL after login.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$redirect_to` | `string` | The redirect URL.
`$user` | `\WP_User` | The logged in user.

Source: [src/shared/LoginHandler.php](../src/shared/LoginHandler.php), [line 683](../src/shared/LoginHandler.php#L683-L689)

### `wptelegram_login_web_app_login_data`

*Filters the data for the web app login.*

This can be used to customize the messages etc. for the web app login UI.

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$data` | `array` | The data for the web app login.

Source: [src/includes/AssetManager.php](../src/includes/AssetManager.php), [line 274](../src/includes/AssetManager.php#L274-L281)

### `wptelegram_login_language_options`

*Filters the language options for the settings page.*

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$data` | `array` | The language options.
`$translations` | `array` | The available translations.

Source: [src/includes/AssetManager.php](../src/includes/AssetManager.php), [line 410](../src/includes/AssetManager.php#L410-L416)

### `wptelegram_login_intercept_request_on`

*Filter the hook and priority to use for intercepting the login request.*

- [Examples](./examples/intercept_request_on.md)

**Arguments**

Argument | Type | Description
-------- | ---- | -----------
`$hook_and_priority` | `array` | The hook and priority.

Source: [src/includes/Main.php](../src/includes/Main.php), [line 392](../src/includes/Main.php#L392-L399)


<p align="center"><a href="https://github.com/pronamic/wp-documentor"><img src="https://cdn.jsdelivr.net/gh/pronamic/wp-documentor@main/logos/pronamic-wp-documentor.svgo-min.svg" alt="Pronamic WordPress Documentor" width="32" height="32"></a><br><em>Generated by <a href="https://github.com/pronamic/wp-documentor">Pronamic WordPress Documentor</a> <code>1.2.0</code></em><p>

