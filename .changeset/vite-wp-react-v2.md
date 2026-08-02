---
"@wpsocio/vite-wp-react": major
---

Rewrite for Vite 8 with a smaller public API.

The `vite-plugin-external` and `esbuild` dependencies have been replaced with a native implementation on top of Vite 8 (Rolldown). WordPress packages are now externalized via CJS shims wired through `resolve.alias`, which works in both build and dev (with proper CJS interop via the dependency optimizer). In build, `dependencies.json` is now derived from the actual module graph instead of a separate scan, making it more accurate.

### Breaking Changes

- Requires Vite 8 (`peerDependencies.vite: ^8`) and Node `^20.19.0 || >=22.12.0`.
- `viteWpReact()` now takes a single options object instead of `(options, config)`. The default export has been removed.
- Options renamed: `externalizeWpPackages` → `externals`, `extractWpDependencies` → `wpDependencies`. Both now default to `true`.
- The `externals` callback now only customizes the global variable name for externalizable candidates (`@wordpress/*` and the known browser globals); returning `undefined` uses the default. Opting out of externalization or externalizing arbitrary packages via the callback is no longer supported.
- `enableReact` has been removed. React support is always enabled.
- The `./plugins` and `./utils` subpath exports have been removed. Only the root and `./config` entries remain. This removes `externalizeWpPackages`, `extractWpDependencies`, `devServer`, `reactMakePot`, `getMakePotReactConfig`, `scanDependencies`, `shouldExternalizePakage` and `IMPORTS_TO_IGNORE` from the public API.
- The esbuild `plugins` option of dependency extraction has been removed.

### Migration

```ts
// Before
import { viteWpReact } from "@wpsocio/vite-wp-react";
viteWpReact(
  { input, outDir },
  { externalizeWpPackages: true, extractWpDependencies: true, makePot: true },
);

// After
import { viteWpReact } from "@wpsocio/vite-wp-react";
viteWpReact({ input, outDir, makePot: true }); // externals and wpDependencies are on by default
```

`createViteConfig()` from `@wpsocio/vite-wp-react/config` is unchanged.
