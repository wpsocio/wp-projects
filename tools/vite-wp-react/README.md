# @wpsocio/vite-wp-react

Set of tools to develop WordPress plugins and themes using React and Vite. It can be used along with `WPSocio\WPUtils\ViteWPReactAssets` from [`wpsocio/wp-utils`](https://packagist.org/packages/wpsocio/wp-utils) composer package.

Requires Vite 8.

## Features

- **WP package externalization** — `@wordpress/*` imports (except the [bundled packages](https://github.com/WordPress/gutenberg/blob/trunk/packages/dependency-extraction-webpack-plugin/lib/util.js) not provided by WordPress) are replaced with `window.wp.*` globals, and known browser globals (`react`, `jquery`, `lodash` etc.) with their global variables, in both build and dev.
- **Dependency extraction** — Generates a `dependencies.json` file listing the WordPress script handles used by each entry, for PHP to declare script dependencies.
- **Dev server handoff** — Finds an available port and writes a `dev-server.json` file for PHP to detect HMR mode, with CORS configured.
- **POT generation** — Extracts translation strings from your components via `@wordpress/babel-plugin-makepot`.

## Installation

```sh
npm install --save-dev @wpsocio/vite-wp-react
```

```sh
yarn add --dev @wpsocio/vite-wp-react
```

```sh
pnpm add -D @wpsocio/vite-wp-react
```

## Usage

### Using the config (recommended)

`createViteConfig()` returns a complete Vite config with sensible defaults — relative asset paths (`base: './'`), assets written to `dist/` inside `outDir`, externalization and dependency extraction enabled.

```ts
// vite.config.ts
import { createViteConfig } from "@wpsocio/vite-wp-react/config";
import { defineConfig } from "vite";

export default defineConfig(
  createViteConfig({
    input: {
      settings: "js/settings/index.tsx",
      "block-editor": "js/block-editor/index.tsx",
    },
    outDir: "src/assets/build",
    makePot: {
      output: "src/languages/js-translations.pot",
    },
    corsOrigin: true,
  }),
);
```

### Using the plugin

Use `viteWpReact()` when you want to compose your own Vite config. It accepts the same options.

```ts
// vite.config.ts
import { viteWpReact } from "@wpsocio/vite-wp-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [
    viteWpReact({
      input: {
        settings: "js/settings/index.tsx",
        "block-editor": "js/block-editor/index.tsx",
      },
      outDir: "src/assets/build",
      assetsDir: "dist",
      makePot: {
        output: "src/languages/js-translations.pot",
      },
      corsOrigin: true,
    }),
  ],
});
```

## Options

| Option           | Type                                               | Default        | Description                                                                               |
| ---------------- | -------------------------------------------------- | -------------- | ----------------------------------------------------------------------------------------- |
| `input`          | `Rollup.InputOption`                               | `'js/main.js'` | The entry point(s) to your application.                                                   |
| `outDir`         | `string`                                           | `'build'`      | The directory to write the build to.                                                      |
| `assetsDir`      | `string`                                           | —              | The directory to write assets to, relative to `outDir`.                                   |
| `externals`      | `boolean \| (name: string) => string \| undefined` | `true`         | Externalize WordPress packages. Pass a function to customize the global variable name.    |
| `wpDependencies` | `boolean \| { fileName?, normalize? }`             | `true`         | Generate a `dependencies.json` file with the WordPress script handles used by each entry. |
| `makePot`        | `boolean \| { output?, headers?, functions? }`     | `false`        | Generate a POT file from your components.                                                 |
| `corsOrigin`     | `boolean \| Array<string>`                         | —              | `cors.origin` value for the dev server.                                                   |

The `externals` callback is called for externalizable candidates — `@wordpress/*` packages and the known browser globals (`NON_WP_PACKAGES`), minus the bundled ones (`BUNDLED_WP_PACKAGES`). It should return the global variable name to use, or `undefined` to use the default.
