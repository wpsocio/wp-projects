# wp-projects

The monorepo to develop WordPress plugins/themes.

## Structure

The monorepo is structured as the `wp-content` folder of a WordPress installation and thus can be directly used as such.

## Packages

The monorepo contains both JS and PHP packages which are shared between the plugins/themes.

## Tools

The monorepo contains tools to develop WordPress plugins/themes.

- [`@wpsocio/wpdev`](./tools/wpdev)
- [`@wpsocio/vite-wp-react`](./tools/vite-wp-react)

## Getting started

- Install Docker
- Run
  - `pnpm install`
  - `pnpm setup:all`
  - `pnpm env-start`
  - `pnpm test:e2e`
