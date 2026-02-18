# AGENTS.md - WP Projects Monorepo

## Overview

This is the **WP Socio** monorepo containing all WordPress plugins from [wpsocio.com](https://wpsocio.com). The repo is structured to mirror a WordPress `wp-content` directory and can be used directly as one. All plugins are Telegram-related WordPress integrations.

**Repository:** `wpsocio/wp-projects`
**Package manager:** pnpm 10.x (with workspaces)
**Node type:** ESM (`"type": "module"`)
**PHP minimum:** 8.0
**WordPress minimum:** 6.6

---

## Directory Structure

```
wp-projects/
├── plugins/                     # WordPress plugins (the main products)
│   ├── wptelegram/              # WP Telegram - main integration plugin
│   ├── wptelegram-comments/     # Telegram Comments widget for posts
│   ├── wptelegram-login/        # Login with Telegram
│   └── wptelegram-widget/       # Telegram channel feed widget
├── packages/
│   ├── js/                      # Shared JavaScript/TypeScript packages
│   │   ├── ui/                  # Core UI library (ShadCN UI + Radix + Tailwind)
│   │   ├── shared-ui/           # Domain-specific shared components
│   │   ├── form/                # react-hook-form wrapper
│   │   ├── i18n/                # @wordpress/i18n wrapper
│   │   ├── services/            # API services and hooks
│   │   └── utilities/           # General utility functions
│   └── php/                     # Shared PHP packages
│       ├── wp-utils/            # WordPress utilities (options, assets, helpers)
│       ├── wptelegram-bot-api/  # Telegram Bot API library
│       └── telegram-format-text/# HTML-to-Telegram text converter
├── tools/                       # Development tooling
│   ├── vite-wp-react/           # Vite plugin for WordPress React builds
│   ├── wpdev/                   # CLI for bundling, linking, release management
│   ├── e2e-utils/               # Playwright E2E test utilities
│   └── e2e-mu-plugins/          # WordPress mu-plugin for E2E REST endpoints
├── config/                      # Shared configs
│   ├── tsconfig.react.json      # Base TypeScript config for React packages
│   └── wpdev.base.project.js    # Shared bundle config for all plugins
├── premium/                     # Premium plugins (separate repo, checked out in CI)
├── .wp-env.json                 # WordPress dev environment config
├── biome.json                   # Biome linter/formatter config
├── composer.json                # Root PHP dependencies (WPCS, WP-CLI)
├── pnpm-workspace.yaml          # Workspace package definitions
├── tailwind.config.css          # Root Tailwind config (IDE intellisense only)
├── wpdev.config.json            # wpdev CLI config
└── .env.example                 # Environment template
```

---

## Plugins

Each plugin follows the same structure:

```
plugins/<name>/
├── dev.php                      # Development entry (loads from src/ directly)
├── js/                          # TypeScript/React source
│   └── <entry>/                 # One directory per Vite entry point
│       ├── index.ts             # Entry point
│       ├── ui/                  # React components
│       │   ├── index.tsx        # Renders React app into DOM root
│       │   ├── styles.scss      # Tailwind + WP style reset entry
│       │   └── App.tsx          # Main app component
│       └── services/            # Business logic, data, API calls
├── src/                         # PHP source (this becomes the distributed plugin)
│   ├── <name>.php               # Production entry point
│   ├── readme.txt               # WordPress.org readme
│   ├── includes/                # PHP classes
│   │   ├── Main.php             # Plugin bootstrap
│   │   ├── AssetManager.php     # Vite asset registration/enqueuing
│   │   ├── restApi/             # REST API controllers
│   │   └── ...
│   ├── admin/                   # Admin-specific code
│   ├── assets/
│   │   ├── build/               # Vite output (manifest.json, JS, CSS)
│   │   └── static/              # Static assets (icons, CSS)
│   ├── languages/               # i18n files (.pot, .po, .mo, .php)
│   └── vendor/                  # Production Composer dependencies
├── package.json                 # Plugin package config
├── composer.json                # PHP dependencies (local path repos)
├── vite.config.ts               # Vite build configuration
├── tsconfig.json                # TypeScript config
└── wpdev.project.js             # wpdev bundle configuration
```

### Plugin Details

| Plugin                  | Package Name                   | Description                                                  | Vite Entries                                           |
| ----------------------- | ------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------ |
| **wptelegram**          | `@wpsocio/wptelegram`          | Send posts to Telegram, private notifications, proxy support | `settings`, `p2tg-block-editor`, `p2tg-classic-editor` |
| **wptelegram-comments** | `@wpsocio/wptelegram-comments` | Telegram Comments widget for posts/pages                     | `settings`                                             |
| **wptelegram-login**    | `@wpsocio/wptelegram-login`    | Login/register via Telegram account                          | `settings`, `blocks`, `web-app-login`, `wp-login`      |
| **wptelegram-widget**   | `@wpsocio/wptelegram-widget`   | Display Telegram channel feed, join button                   | `blocks`, `public`, `settings`                         |

### How Plugins Load Assets

Each plugin's `AssetManager.php` uses `ViteWPReactAssets` from `@wpsocio/wp-utils`:

1. **Registration:** `$assets->register($entry, [...])` reads `manifest.json` (production) or `dev-server.json` (dev) to register scripts/styles
2. **Enqueuing:** `$assets->enqueue($entry, [...])` enqueues the registered assets with optional inline styles
3. **Dependencies:** `JsDependencies` reads `dependencies.json` (generated by Vite build) to set WordPress script dependencies
4. **Inline data:** Plugin data (settings, API URLs, i18n) is injected via `wp_add_inline_script()` as a global JS variable

### CSS Layer Strategy

WordPress admin CSS conflicts with Tailwind. The plugins solve this with CSS layers:

```css
@layer wp, theme, base, components, utilities;
```

- **`wp` layer:** WordPress common CSS is imported here (lowest priority), plus scoped Tailwind preflight
- **`theme`/`base`/`components`/`utilities`:** Standard Tailwind layers (higher priority)
- Each plugin's `styles.scss` uses SCSS mixins from `@wpsocio/ui/mixins.scss`:
  - `reset-wp-common-css` - Resets WordPress default styles using `revert-layer`
  - `scope-tw-preflight($selector)` - Scopes Tailwind preflight to the plugin's root element

### Plugin SCSS Entry Pattern

Every plugin's `js/<entry>/ui/styles.scss` follows this pattern:

```scss
@use "@wpsocio/ui/mixins.scss" as *;
@import "@wpsocio/ui/globals.css";

@source "./**/*.{ts,tsx}";
@source "../../../node_modules/@wpsocio/shared-ui/{components,form}/**/*.{ts,tsx}";
@source "../../../node_modules/@wpsocio/ui/src/**/*.{ts,tsx}";

@include reset-wp-common-css;
@include scope-tw-preflight("#<plugin-root-element-id>");
```

### Plugin React Entry Pattern

Every plugin's `js/<entry>/ui/index.tsx` follows this pattern:

```tsx
import "./styles.scss";
import { cleanup, setI18nData } from "@wpsocio/services/utils";
import { Toaster } from "@wpsocio/ui/components/sonner";
import React from "react";
import ReactDOM from "react-dom/client";
import { ROOT_ID } from "../constants";
import App from "./App";

const root = document.getElementById(ROOT_ID);
cleanup(ROOT_ID, { disableCommonCSS: true });
setI18nData("<text_domain>", "<text-domain>");

root
  ? ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
        <Toaster />
      </React.StrictMode>,
    )
  : console.error(`Root element not found: ${ROOT_ID}`);
```

---

## JavaScript Packages (`packages/js/`)

### Dependency Graph

```
Plugin code
  └─→ @wpsocio/shared-ui (domain components)
       ├─→ @wpsocio/ui (core UI library)
       ├─→ @wpsocio/form (form state)
       ├─→ @wpsocio/i18n (translations)
       ├─→ @wpsocio/services (API/hooks)
       └─→ @wpsocio/utilities (helpers)
```

### `@wpsocio/ui` — Core UI Library

**The central UI package based on ShadCN UI (Radix UI + Tailwind CSS v4).**

#### Architecture: Three Layers

```
Layer 1: components/   ← Raw ShadCN UI components (Radix + CVA + Tailwind)
Layer 2: wrappers/     ← Enhanced wrappers with added functionality
Layer 3: (shared-ui)   ← Domain-specific components (separate package)
```

#### Package Exports

```
@wpsocio/ui/globals.css          → src/styles/globals.css
@wpsocio/ui/mixins.scss          → src/styles/mixins.scss
@wpsocio/ui/postcss.config       → postcss.config.mjs
@wpsocio/ui/lib/*                → src/lib/*.ts
@wpsocio/ui/components/*         → src/components/*.tsx
@wpsocio/ui/wrappers             → src/wrappers/index.ts
@wpsocio/ui/wrappers/*           → src/wrappers/*.tsx
@wpsocio/ui/wrappers/types       → src/wrappers/types.ts
@wpsocio/ui/icons                → src/icons/index.tsx
@wpsocio/ui/hooks/*              → src/hooks/*.ts
```

#### Layer 1: Base Components (`src/components/`)

These are standard ShadCN UI components — generated via the `shadcn` CLI, styled with Tailwind CSS and CVA (class-variance-authority). They are built on Radix UI primitives.

| Component          | Radix Primitive                | Notes                                                                                             |
| ------------------ | ------------------------------ | ------------------------------------------------------------------------------------------------- |
| `accordion.tsx`    | `@radix-ui/react-accordion`    |                                                                                                   |
| `alert-dialog.tsx` | `@radix-ui/react-alert-dialog` |                                                                                                   |
| `alert.tsx`        | —                              | CVA variants: default, destructive                                                                |
| `badge.tsx`        | —                              | CVA variants: default, secondary, destructive, outline                                            |
| `button.tsx`       | `@radix-ui/react-slot`         | CVA variants: default, destructive, outline, secondary, ghost, link; sizes: default, sm, lg, icon |
| `card.tsx`         | —                              | Header, title, description, content, footer                                                       |
| `checkbox.tsx`     | `@radix-ui/react-checkbox`     |                                                                                                   |
| `collapsible.tsx`  | `@radix-ui/react-collapsible`  |                                                                                                   |
| `dialog.tsx`       | `@radix-ui/react-dialog`       |                                                                                                   |
| `form.tsx`         | —                              | React Hook Form + `@radix-ui/react-label` + `@radix-ui/react-slot`                                |
| `input.tsx`        | —                              |                                                                                                   |
| `label.tsx`        | `@radix-ui/react-label`        | CVA styled                                                                                        |
| `popover.tsx`      | `@radix-ui/react-popover`      |                                                                                                   |
| `radio-group.tsx`  | `@radix-ui/react-radio-group`  |                                                                                                   |
| `scroll-area.tsx`  | `@radix-ui/react-scroll-area`  |                                                                                                   |
| `select.tsx`       | `@radix-ui/react-select`       |                                                                                                   |
| `separator.tsx`    | `@radix-ui/react-separator`    |                                                                                                   |
| `sonner.tsx`       | —                              | Sonner toast library                                                                              |
| `switch.tsx`       | `@radix-ui/react-switch`       |                                                                                                   |
| `tabs.tsx`         | `@radix-ui/react-tabs`         |                                                                                                   |
| `textarea.tsx`     | —                              |                                                                                                   |
| `tooltip.tsx`      | `@radix-ui/react-tooltip`      |                                                                                                   |

**Important:** The `biome.json` linter config **excludes** `packages/js/ui/src/components/**/*` from linting since these are generated by shadcn CLI.

#### Layer 2: Wrapper Components (`src/wrappers/`)

Wrappers enhance base components with domain-specific features. Key enhancements:

| Wrapper                   | Enhancement                                                                                                                         |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `button.tsx`              | Adds `isLoading` prop with `<Spinner />`                                                                                            |
| `input.tsx`               | Adds `addonStart`, `addonEnd`, `isInvalid`, `wrapperClassName`                                                                      |
| `select.tsx`              | Accepts `options: Array<OptionProps \| SelectOptionGroup>`, loading state, portal container via `window.__WPSOCIO_UI_ROOT_SELECTOR` |
| `checkbox.tsx`            | Labeled checkbox with description                                                                                                   |
| `checkbox-group.tsx`      | Array of checkboxes from `options` prop, manages `defaultValue`                                                                     |
| `radio-group.tsx`         | Array of radio buttons from `options` prop, inline/block layout                                                                     |
| `react-select.tsx`        | `react-select` with Tailwind styling, custom components, async support                                                              |
| `modal.tsx`               | Simplified Dialog API: `trigger`, `title`, `description`, `content`                                                                 |
| `confirmation-dialog.tsx` | AlertDialog wrapper for confirmations                                                                                               |
| `color-input-picker.tsx`  | `react-colorful` HexColorPicker in a popover                                                                                        |
| `label.tsx`               | Adds `isRequired` prop (renders asterisk)                                                                                           |
| `form.tsx`                | Re-exports form components with enhanced FormLabel                                                                                  |
| `link.tsx`                | Styled anchor with external link support                                                                                            |
| `toast.tsx`               | Re-exports Sonner toast system                                                                                                      |
| `spinner.tsx`             | Lucide `Loader2` with spin animation                                                                                                |
| `icon-button.tsx`         | Icon-only button variant                                                                                                            |
| `vertical-divider.tsx`    | Vertical separator                                                                                                                  |

**Shared Types (`wrappers/types.ts`):**

```typescript
type OptionProps<ExtraProps = unknown> = {
  label: string;
  value: string;
} & ExtraProps;
type OptionsType<ExtraProps = unknown> = Array<OptionProps<ExtraProps>>;
```

#### Utility: `cn()` Function (`src/lib/utils.ts`)

```typescript
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

#### Icons (`src/icons/`)

Re-exports from `lucide-react`:
`AlertCircle`, `Warning` (AlertTriangle), `ArrowRight`, `Success` (CheckCircle), `Copy`, `Edit`, `Info`, `Close` (X), `ChevronDown`, `ChevronUp`, `Save`, `Plus` (PlusIcon), `Trash`

#### Hooks (`src/hooks/`)

- `useClipboard` — Copy to clipboard with feedback state
- `useDebouncedValue` — Generic debounce
- `useMediaQuery` — CSS media query matching via `useSyncExternalStore`
- `usePrevious` — Track previous value

#### Key External Dependencies

- **Radix UI:** 13 `@radix-ui/*` packages (accordion, alert-dialog, checkbox, collapsible, dialog, label, popover, radio-group, scroll-area, select, separator, switch, tooltip)
- **Styling:** Tailwind CSS v4, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`
- **Form:** `react-hook-form`, `@hookform/resolvers`, `zod`
- **Other:** `lucide-react`, `react-select`, `react-colorful`, `sonner`

#### ShadCN Configuration (`components.json`)

```json
{
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "css": "styles/global.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@wpsocio/ui/components",
    "hooks": "@wpsocio/ui/hooks",
    "lib": "@wpsocio/ui/lib",
    "ui": "@wpsocio/ui/components",
    "utils": "@wpsocio/ui/lib/utils"
  }
}
```

### `@wpsocio/shared-ui` — Domain Components

Built on top of `@wpsocio/ui`, these are WordPress/Telegram-specific components.

**Structure:**

```
shared-ui/
├── components/           # General domain components
│   ├── section-card.tsx         # Card with title for settings sections
│   ├── wp-admin-container.tsx   # WP admin page layout (main + sidebar)
│   ├── instructions.tsx         # Setup instructions display
│   ├── code.tsx                 # Code display component
│   ├── description.tsx          # Help text component
│   ├── variable-button.tsx      # Clickable variable insertion button
│   ├── youtube-video.tsx        # YouTube embed
│   ├── plugin-info/             # Plugin info sidebar cards
│   ├── widget-info/             # Widget info display
│   └── wptg-social-icons.tsx    # WP Telegram social media icons
├── form/                 # Form field components
│   ├── form-field.tsx           # FormField with useFormContext integration
│   ├── form-item.tsx            # Label + control + description + error layout
│   ├── multi-checkbox-field.tsx # Multiple checkboxes from options
│   ├── bot-token-field.tsx      # Telegram bot token input with test button
│   ├── use-bot-token-test.tsx   # Hook for testing bot tokens
│   ├── use-chat-with-test.tsx   # Hook for testing chat IDs
│   ├── form-debug.tsx           # Debug view for form values
│   ├── submit/                  # Submit/reset buttons + bar
│   └── test-result/             # API test result display
└── wptelegram/           # WP Telegram-specific components
    ├── active-field.tsx         # Module on/off toggle
    ├── channels-field.tsx       # Telegram channel selector
    ├── message-template.tsx     # Message template editor
    ├── parse-mode-field.tsx     # Markdown/HTML parse mode
    ├── rules/                   # Post-to-Telegram rule builder
    ├── proxy/                   # Proxy configuration UI
    └── ...                      # ~28 components total
```

### `@wpsocio/form` — Form State Management

Wraps `react-hook-form` with a `<Form>` provider that stores forms in `window.__WP_RHF_FORMS__` for debugging.

**Exports:** `Form`, `useForm`, `useFormContext`, `useFieldArray`, `useWatch`, `useFormState`, `zodResolver`, `useFieldError`

### `@wpsocio/i18n` — Internationalization

Wraps `@wordpress/i18n` with a configurable text domain.

**Exports:** `__()`, `_n()`, `_nx()`, `_x()`, `isRTL()`, `sprintf`, `setLocaleData()`

### `@wpsocio/services` — API Services

- `api-fetch/` — Wrapper around `@wordpress/api-fetch` with GET/POST/PUT helpers
- `telegram/` — Telegram-specific API calls
- `use-submit-form.ts` — Form submission with REST API
- `use-display-feedback.ts` — Success/error toast notifications
- `use-active-tab.ts` — Tab state with URL hash sync
- `get-plugin-data.ts` — Read plugin data from inline script globals

### `@wpsocio/utilities` — General Utilities

- `types.ts` — TypeScript utility types (`AnyObject`, etc.)
- `misc.ts` — Miscellaneous helpers
- `fields.ts` — Field-related utilities
- `blocks.ts` — WordPress Gutenberg block utilities
- `uniq-id.ts` — Unique ID generation (`@paralleldrive/cuid2`)
- `createInterpolateElement.ts` — String interpolation for JSX

---

## PHP Packages (`packages/php/`)

### `wpsocio/wp-utils`

**Namespace:** `WPSocio\WPUtils`

| Class               | Purpose                                                                                |
| ------------------- | -------------------------------------------------------------------------------------- |
| `ViteWPReactAssets` | Manages Vite asset registration/enqueuing in WordPress (dev HMR + production manifest) |
| `Options`           | WordPress options wrapper with Iterator/ArrayAccess, dot-notation paths, JSON storage  |
| `Helpers`           | Static utility methods (sanitization, file type detection, post type checks, etc.)     |
| `JsDependencies`    | Reads `dependencies.json` to provide JS dependency handles                             |
| `Requirements`      | Plugin requirements checker (PHP/WP version)                                           |

### `wpsocio/wptelegram-bot-api`

**Namespace:** `WPTelegram\BotAPI`

Telegram Bot API HTTP client using WordPress `wp_remote_post()`. Classes: `API`, `Client`, `Request`, `Response`, REST API controllers.

**Critical:** `init.php` calls `die` if `ABSPATH` is not defined. It's loaded via Composer `autoload_files`, which silently kills PHPUnit.

### `wpsocio/telegram-format-text`

**Namespace:** `WPSocio\TelegramFormatText`

HTML-to-text converter for Telegram Bot API formatting. Supports Markdown V1, Markdown V2, HTML, and plain text output.

### How Plugins Consume PHP Packages

Each plugin's `composer.json` uses path repositories:

```json
{
  "repositories": [
    { "type": "path", "url": "../../packages/php/wp-utils" },
    { "type": "path", "url": "../../packages/php/wptelegram-bot-api" }
  ],
  "require": {
    "wpsocio/wp-utils": "dev-main"
  }
}
```

---

## Build System

### Vite Configuration

Each plugin's `vite.config.ts`:

```typescript
import { createViteConfig } from "@wpsocio/vite-wp-react/config";
import { defineConfig } from "vite";

export default defineConfig(
  createViteConfig({
    input: {
      settings: "js/settings/index.ts",
      // ... other entries
    },
    outDir: "src/assets/build",
    makePot: { output: "src/languages/js-translations.pot" },
    corsOrigin: true,
  }),
);
```

**`@wpsocio/vite-wp-react`** provides:

1. **`externalizeWpPackages`** — Maps `@wordpress/*` imports to `window.wp.*` globals (e.g., `@wordpress/data` → `wp.data`). Also maps `react` → `React`, `jquery` → `jQuery`, etc.
2. **`extractWpDependencies`** — Scans imports and generates `dependencies.json` listing WordPress script handles needed
3. **`reactMakePot`** — Generates `.pot` files for i18n via `@wordpress/babel-plugin-makepot`
4. **`devServer`** — Finds available port, writes `dev-server.json` for PHP to detect HMR mode, configures CORS

**Build output:** `src/assets/build/` containing `manifest.json`, hashed JS/CSS files, and `dependencies.json`

### wpdev CLI (`@wpsocio/wpdev`)

CLI for managing WordPress projects in the monorepo.

**Commands:**

- `wpdev bundle [projects]` — Full release pipeline: build, version bump, changelog, i18n, CSS minification, validation, ZIP archive
- `wpdev link [projects]` — Symlink plugins to local WordPress installation (uses `WP_CONTENT_DIR` from `.env`)
- `wpdev unlink [projects]` — Remove symlinks
- `wpdev clean [path]` — Remove node_modules, vendor, ignored files
- `wpdev project-info [projects]` — Output project config as JSON

**Bundle pipeline** (defined in `config/wpdev.base.project.js`):

1. `run-scripts` — Run `setup:php:prod` and `build`
2. `update-requirements` — Update PHP/WP version requirements
3. `update-version` — Update version in package.json, readme.txt, PHP files
4. `update-changelog` — Generate changelog from changesets
5. `i18n-make-pot` — Generate POT translation file
6. `i18n-update-po` — Update PO files
7. `i18n-make-mo` — Compile MO files
8. `i18n-make-php` — Convert PO to PHP
9. `i18n-js-pot-to-php` — Convert JS POT to PHP
10. `minify-styles` — Minify CSS files
11. `validate-files` — Verify build artifacts exist
12. `copy-files` — Copy to output directory
13. `create-archive` — Create ZIP

### Wireit Task Orchestration

The root `package.json` uses Wireit for task dependency management:

- `pnpm build` — Build tools first, then all packages and plugins
- `pnpm dev` — Start all dev servers concurrently
- `pnpm test:php` — Run PHP tests across all packages
- `pnpm typecheck` — Type-check tools, packages, and plugins separately

### Changeset Releases

- `pnpm changeset` — Create a new changeset
- `pnpm prep-version` — Apply changesets and update versions
- `pnpm prep-release` — Bundle changed packages for release
- `pnpm release` — Publish to npm

---

## Development Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Build tools and packages
pnpm setup:all

# 3. Start WordPress environment
pnpm env-start

# 4. Start dev servers (all plugins with HMR)
pnpm dev

# 5. Link plugins to a local WordPress site
echo 'WP_CONTENT_DIR=/path/to/wp-content' > .env
npx wpdev link --all
```

### WordPress Environment

`.wp-env.json` maps plugins and packages into Docker containers:

- `wp-content/plugins/wptelegram` → `./plugins/wptelegram`
- `wp-content/plugins/wptelegram-comments` → `./plugins/wptelegram-comments`
- `wp-content/plugins/wptelegram-login` → `./plugins/wptelegram-login`
- `wp-content/plugins/wptelegram-widget` → `./plugins/wptelegram-widget`
- `wp-content/packages/php` → `./packages/php`

---

## Testing

### PHP Tests

```bash
pnpm test:php          # Run all PHP tests
```

**Critical gotcha:** `wptelegram-bot-api/init.php` calls `die` if `ABSPATH` is not defined. Use `php -d auto_prepend_file=tests/prepend.php` to define `ABSPATH` before the Composer autoloader runs.

### E2E Tests

```bash
pnpm test:e2e          # Run Playwright tests
pnpm test:e2e:debug    # Run with Playwright UI
```

Uses `@wpsocio/e2e-utils` with `Actions`, `REST`, `Mocks` classes and `BlockEditor`/`ClassicEditor` page objects.

### Linting

```bash
pnpm lint:js           # Biome lint
pnpm lint:js:fix       # Biome format --fix
pnpm lint:php          # PHP_CodeSniffer with WordPress standards
pnpm typecheck         # TypeScript type checking
```

---

## Premium Plugins

A separate private repo is checked out into `premium/`. It's part of pnpm workspaces (see `pnpm-workspace.yaml`). The lockfile is maintained in this repo. CI workflows check out the premium repo and install dependencies as needed.
