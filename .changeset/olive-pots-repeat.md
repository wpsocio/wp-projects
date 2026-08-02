---
"@wpsocio/vite-wp-react": patch
"@wpsocio/wpdev": patch
---

Maintenance: build with tsdown (rolldown) instead of tsup for faster builds. Output files now use explicit `.mjs`/`.cjs` extensions and ship declaration maps. The default export of `viteWpReact` is deprecated in favour of the named export.
