# WP Telegram Bot API

Telegram Bot API library for WordPress.

## Usage

```bash
composer require wpsocio/wptelegram-bot-api
```

```php
require_once __DIR__ . '/autoload.php';

$bot_token  = 'YOUR BOT TOKEN HERE';

$bot_api = new \WPTelegram\BotAPI\API( $bot_token );

$bot_api->sendMessage( [
    'chat_id' => 123456789,
    'text'    => 'Hello World',
] );

$bot_api->sendPhoto( [
    'chat_id' => 123456789,
    'photo'   => 'https://domain.com/path/to/photo.jpg',
] );
```

## Requirements

- `PHP >= 8.0`
- `WP >= 6.4`
