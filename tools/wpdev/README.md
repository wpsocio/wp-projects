# @wpsocio/wpdev

A CLI to manage WordPress projects in a monorepo or a standalone repo.

## Requirements

- [WP CLI](https://wp-cli.org/) - Required for i18n features.

## Installation

```sh
npm install --save-dev @wpsocio/wpdev
```

```sh
yarn add --dev @wpsocio/wpdev
```

```sh
pnpm add -D @wpsocio/wpdev
```

## Usage

<!-- usage -->

```sh-session
$ npm install -g @wpsocio/wpdev
$ wpdev COMMAND
running command...
$ wpdev (--version)
@wpsocio/wpdev/1.0.3 linux-x64 node-v20.11.0
$ wpdev --help [COMMAND]
USAGE
  $ wpdev COMMAND
...
```

<!-- usagestop -->

## Commands

<!-- commands -->
* [`wpdev bundle [PROJECTS]`](#wpdev-bundle-projects)
* [`wpdev clean [PATH]`](#wpdev-clean-path)
* [`wpdev link [PROJECTS]`](#wpdev-link-projects)
* [`wpdev project-info [PROJECTS]`](#wpdev-project-info-projects)
* [`wpdev unlink [PROJECTS]`](#wpdev-unlink-projects)

## `wpdev bundle [PROJECTS]`

Prepares and bundles projects for distribution or deployment.

```
USAGE
  $ wpdev bundle [PROJECTS] [-r <value>] [-m wp-monorepo|standalone] [-t plugins|themes] [-e <value>]
    [--all] [--from-changeset --changeset-json <value>] [-d <value>] [-p npm|yarn|pnpm|bun] [-c] [-v <value> | -t
    major|minor|patch|premajor|preminor|prepatch|prerelease]

ARGUMENTS
  PROJECTS  Project(s) to target.

FLAGS
  -c, --[no-]archive               Create a compressed archive (zip) of the bundled project.
  -d, --out-dir=<value>            [default: dist] Path to the output directory. Defaults to "dist".
  -e, --env-file=<value>...        Environment file(s) to load
  -m, --operation-mode=<option>    Operation mode.
                                   <options: wp-monorepo|standalone>
  -p, --package-manager=<option>   [default: npm] Package manager to use.
                                   <options: npm|yarn|pnpm|bun>
  -r, --root-dir=<value>           Root directory. Can be an absolute or a relative path.
  -t, --project-types=<option>...  Project types managed in the monorepo. Only used in wp-monorepo mode.
                                   <options: plugins|themes>
  -t, --release-type=<option>      Release type to update to.
                                   <options: major|minor|patch|premajor|preminor|prepatch|prerelease>
  -v, --version=<value>            Version to update to.
      --all                        Target all projects in monorepo.
      --changeset-json=<value>     Path to the changeset status JSON file. Pass the {filePath} given to `changset status
                                   --output={filePath}`
      --from-changeset             Target projects in monorepo from changesets.

DESCRIPTION
  Prepares and bundles projects for distribution or deployment.

EXAMPLES
  $ wpdev bundle

  $ wpdev bundle wptelegram test-theme

  $ wpdev bundle --all
```

_See code: [src/commands/bundle.ts](https://github.com/wpsocio/wp-projects/blob/@wpsocio/wpdev@1.0.3/tools/wpdev/src/commands/bundle.ts)_

## `wpdev clean [PATH]`

Cleans up the given path(s) in this monorepo.

```
USAGE
  $ wpdev clean [PATH] [-r <value>] [-m wp-monorepo|standalone] [-t plugins|themes] [-e <value>] [-i
    ignored|node_modules|composer.lock|vendor] [--all]

ARGUMENTS
  PATH  Path to clean. Relative to root directory

FLAGS
  -e, --env-file=<value>...        Environment file(s) to load
  -i, --include=<option>...        Type of files to delete
                                   <options: ignored|node_modules|composer.lock|vendor>
  -m, --operation-mode=<option>    Operation mode.
                                   <options: wp-monorepo|standalone>
  -r, --root-dir=<value>           Root directory. Can be an absolute or a relative path.
  -t, --project-types=<option>...  Project types managed in the monorepo. Only used in wp-monorepo mode.
                                   <options: plugins|themes>
      --all                        Clean everything

DESCRIPTION
  Cleans up the given path(s) in this monorepo.

EXAMPLES
  $ wpdev clean plugins/wptelegram --include=ignored --include=node_modules

  $ wpdev clean --all
```

_See code: [src/commands/clean.ts](https://github.com/wpsocio/wp-projects/blob/@wpsocio/wpdev@1.0.3/tools/wpdev/src/commands/clean.ts)_

## `wpdev link [PROJECTS]`

Creates symlinks in the given wp-content directory for the project(s) in this monorepo.

```
USAGE
  $ wpdev link [PROJECTS] [-r <value>] [-m wp-monorepo|standalone] [-t plugins|themes] [-e <value>]
    [--all] [--from-changeset --changeset-json <value>] [-d <value>]

ARGUMENTS
  PROJECTS  Project(s) to target.

FLAGS
  -d, --wp-content-dir=<value>     Path to the WordPress content directory.
  -e, --env-file=<value>...        Environment file(s) to load
  -m, --operation-mode=<option>    Operation mode.
                                   <options: wp-monorepo|standalone>
  -r, --root-dir=<value>           Root directory. Can be an absolute or a relative path.
  -t, --project-types=<option>...  Project types managed in the monorepo. Only used in wp-monorepo mode.
                                   <options: plugins|themes>
      --all                        Target all projects in monorepo.
      --changeset-json=<value>     Path to the changeset status JSON file. Pass the {filePath} given to `changset status
                                   --output={filePath}`
      --from-changeset             Target projects in monorepo from changesets.

DESCRIPTION
  Creates symlinks in the given wp-content directory for the project(s) in this monorepo.

EXAMPLES
  $ wpdev link

  $ wpdev link wptelegram test-theme

  $ wpdev link --all
```

_See code: [src/commands/link.ts](https://github.com/wpsocio/wp-projects/blob/@wpsocio/wpdev@1.0.3/tools/wpdev/src/commands/link.ts)_

## `wpdev project-info [PROJECTS]`

Get the project info as JSON.

```
USAGE
  $ wpdev project-info [PROJECTS] [-r <value>] [-m wp-monorepo|standalone] [-t plugins|themes] [-e <value>]
    [--all] [--from-changeset --changeset-json <value>] [--pretty]

ARGUMENTS
  PROJECTS  Project(s) to target.

FLAGS
  -e, --env-file=<value>...        Environment file(s) to load
  -m, --operation-mode=<option>    Operation mode.
                                   <options: wp-monorepo|standalone>
  -r, --root-dir=<value>           Root directory. Can be an absolute or a relative path.
  -t, --project-types=<option>...  Project types managed in the monorepo. Only used in wp-monorepo mode.
                                   <options: plugins|themes>
      --all                        Target all projects in monorepo.
      --changeset-json=<value>     Path to the changeset status JSON file. Pass the {filePath} given to `changset status
                                   --output={filePath}`
      --from-changeset             Target projects in monorepo from changesets.
      --pretty                     Pretty print the JSON output.

DESCRIPTION
  Get the project info as JSON.

EXAMPLES
  $ wpdev project-info

  $ wpdev project-info wptelegram test-theme

  $ wpdev project-info --all
```

_See code: [src/commands/project-info.ts](https://github.com/wpsocio/wp-projects/blob/@wpsocio/wpdev@1.0.3/tools/wpdev/src/commands/project-info.ts)_

## `wpdev unlink [PROJECTS]`

Removes symlinks in the given wp-content directory created for the project(s) in this monorepo.

```
USAGE
  $ wpdev unlink [PROJECTS] [-r <value>] [-m wp-monorepo|standalone] [-t plugins|themes] [-e <value>]
    [--all] [--from-changeset --changeset-json <value>] [-d <value>]

ARGUMENTS
  PROJECTS  Project(s) to target.

FLAGS
  -d, --wp-content-dir=<value>     Path to the WordPress content directory.
  -e, --env-file=<value>...        Environment file(s) to load
  -m, --operation-mode=<option>    Operation mode.
                                   <options: wp-monorepo|standalone>
  -r, --root-dir=<value>           Root directory. Can be an absolute or a relative path.
  -t, --project-types=<option>...  Project types managed in the monorepo. Only used in wp-monorepo mode.
                                   <options: plugins|themes>
      --all                        Target all projects in monorepo.
      --changeset-json=<value>     Path to the changeset status JSON file. Pass the {filePath} given to `changset status
                                   --output={filePath}`
      --from-changeset             Target projects in monorepo from changesets.

DESCRIPTION
  Removes symlinks in the given wp-content directory created for the project(s) in this monorepo.

EXAMPLES
  $ wpdev unlink

  $ wpdev unlink wptelegram test-theme

  $ wpdev unlink --all
```

_See code: [src/commands/unlink.ts](https://github.com/wpsocio/wp-projects/blob/@wpsocio/wpdev@1.0.3/tools/wpdev/src/commands/unlink.ts)_

<!-- commandsstop -->
