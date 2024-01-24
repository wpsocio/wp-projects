# @wpsocio/vite-wp-react

Set of tools to develop WordPress plugins and themes using React and Vite. It can be used along with `WPSocio\WPUtils\ViteWPReactAssets` from [`wpsocio/wp-utils`](https://packagist.org/packages/wpsocio/wp-utils) composer package.

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
  })
);
```

Or use the vite plugin:

```ts
// vite.config.ts
import viteWpReact from "@wpsocio/vite-wp-react";
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
      }
    ),
  ],
});
```

You can also use the plugins separately.
