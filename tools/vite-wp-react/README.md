# @wpsocio/vite-wp-react

Set of tools to develop WordPress plugins and themes using React and Vite. It can be used along with `WPSocio\WPUtils\ViteWPReactAssets` from [`wpsocio/wp-utils`](https://packagist.org/packages/wpsocio/wp-utils) composer package.

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

Or use the vite plugin:

```ts
// vite.config.ts
import { viteWpReact } from "@wpsocio/vite-wp-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    viteWpReact(
      {
        input: {
          settings: "js/settings/index.tsx",
          "block-editor": "js/block-editor/index.tsx",
        },
        outDir: "src/assets/build",
        assetsDir: "dist",
      },
      {
        extractWpDependencies: true,
        externalizeWpPackages: true,
        enableReact: true,
        makePot: {
          output: "src/languages/js-translations.pot",
        },
        corsOrigin: true,
      },
    ),
  ],
});
```

You can pass a callback to `extractWpDependencies` to control which dependencies to extract.

```ts

You can also import and use the plugins individually.
```
