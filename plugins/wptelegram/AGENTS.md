# WP Telegram - Agent Guide

## Plugin Upgrade System

The upgrade system lives in `src/includes/Upgrade.php` and runs on every page load via the `plugins_loaded` hook (priority 10).

### How it works

1. `do_upgrade()` compares the stored version (`get_option('wptelegram_ver')`, default `'1.9.4'`) against the current plugin version (`WPTELEGRAM_VER` defined in `src/wptelegram.php`).
2. If stored version < current version, it defines the `WPTELEGRAM_DOING_UPGRADE` PHP constant and runs sequential version-specific upgrade methods (e.g., `upgrade_to_4_1_0()`).
3. Each upgrade step is handled by `upgrade_to()`, which calls the version-specific method (if it exists) and then updates the stored version via `update_option('wptelegram_ver', $version)`.
4. `Main::hookup()` (priority 20) checks `doing_upgrade()` — if true, it skips loading admin hooks and the settings UI shows a "please reload" notice instead.
5. On the next page load, the version comparison passes (versions match), `do_upgrade()` returns early, the constant is never defined, and the full UI loads normally.

### Critical invariant

`update_option('wptelegram_ver', $version)` MUST execute after each upgrade step. If it doesn't, the user gets permanently stuck seeing the upgrade notice on every page load, because:

- The constant `WPTELEGRAM_DOING_UPGRADE` is defined before upgrades run and cannot be undefined within the same PHP request.
- If the version option isn't updated, the next request triggers the same upgrade again, re-defines the constant, and the cycle repeats.

This is why individual upgrade methods are wrapped in `try/catch (\Throwable)` — to ensure the version update always runs even if a migration method fails.

### Adding new upgrade methods

When adding a migration for version X.Y.Z:

1. Add the version string to the `$version_upgrades` array in `do_upgrade()`.
2. Create a `protected function upgrade_to_X_Y_Z()` method (dots replaced with underscores).
3. The method is only called for existing installs (`$is_new_install = false`). Fresh installs skip migration methods but still update the version option.
4. Keep migration methods idempotent where possible — they may run on partially-migrated data if a previous attempt failed mid-way.
5. Use `WPTG()->options()->get($section)` / `->set($section, $value)` to read/write plugin options (stored as JSON in the `wptelegram` option row).

## Testing

Tests run inside the wp-env Docker container against a real WordPress + MySQL database using PHPUnit 9.6 and `WP_UnitTestCase` (per-test DB transaction rollback).

### Running tests

```bash
# Requires wp-env running (pnpm -w run env-start from monorepo root)
pnpm run test:php
```

### Architecture

- **PHPUnit 9.6** + **yoast/phpunit-polyfills v2** — required for compatibility with the WordPress test framework bundled in wp-env (`/wordpress-phpunit/`). PHPUnit 10+ is incompatible.
- **`tests/prepend.php`** — Auto-prepend file loaded via `php -d auto_prepend_file=tests/prepend.php`. This is critical because `wptelegram-bot-api/init.php` is eagerly loaded by Composer's autoloader (via `autoload_files`) and calls `die` if `ABSPATH` is not defined. The prepend file:
  1. Defines `ABSPATH` before the autoloader runs.
  2. Loads `wp-includes/plugin.php` so `add_action()` is available for the autoload file.
- **`tests/bootstrap.php`** — Sets the polyfills path, points `WPTELEGRAM_MAIN_FILE` to `dev.php` (so the dev `vendor/` autoloader is used instead of the production `src/vendor/` path), pre-sets `wptelegram_ver` to `'999.0.0'` so `do_upgrade()` returns early during WordPress init (prevents `WPTELEGRAM_DOING_UPGRADE` from being defined), then loads the plugin.
- **`tests/helpers/UpgradeHelper.php`** — Uses PHP Reflection to reset singleton state (`Main::$instance`, `Main::$initiated`, `BaseClass::$instances`) between tests.

### Test ordering (constants)

`WPTELEGRAM_DOING_UPGRADE` is a PHP constant — once defined it cannot be undefined. Tests that check "no upgrade needed" (early return, constant not defined) must run before tests that trigger an actual upgrade. PHPUnit runs methods in declaration order within a class, so keep "no upgrade" tests at the top of the file.

### Adding new tests

1. Add test methods to `tests/UpgradeTest.php` (or create new `*Test.php` files in `tests/`).
2. Call `UpgradeHelper::reset_all()` in `setUp()` to reset singletons.
3. Set `wptelegram_ver` to control which upgrade methods run.
4. Use `update_option('wptelegram', '{}')` or similar to simulate an existing install (fresh installs skip version-specific methods).
