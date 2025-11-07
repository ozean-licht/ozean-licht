# uv Projects Guide: Working on Projects

## Overview

The guide covers managing Python projects with uv, which uses `pyproject.toml` files to define dependencies and project metadata.

## Creating Projects

Users can initialize new projects via `uv init hello-world` or `uv init` in an existing directory. This generates essential files including `.gitignore`, `.python-version`, `README.md`, `main.py`, and `pyproject.toml`. The starter script can be tested immediately with `uv run main.py`.

## Project Structure

**Core Components:**

- **pyproject.toml**: Contains project metadata and dependency specifications. As noted, this file "is used to specify the broad requirements of your project" and can be edited manually or via CLI commands.

- **.python-version**: Specifies the default Python version for the project's virtual environment.

- **.venv**: The isolated project environment where dependencies install.

- **uv.lock**: A "cross-platform lockfile that contains exact information about your project's dependencies." This human-readable TOML file should be version-controlled for reproducible installations.

## Managing Dependencies

Key commands include:

- `uv add requests` — adds packages
- `uv add 'requests==2.31.0'` — specifies version constraints
- `uv add -r requirements.txt` — imports dependencies from existing files
- `uv remove requests` — removes packages
- `uv lock --upgrade-package requests` — updates specific packages

## Adding Dependencies

The `uv add` command installs packages into your project:

```
$ uv add requests
```

You can specify version constraints or alternative sources:

```
$ uv add 'requests==2.31.0'
$ uv add git+https://github.com/psf/requests
```

For migrating from existing requirements files:

```
$ uv add -r requirements.txt -c constraints.txt
```

## Removing Dependencies

The `uv remove` command eliminates packages from your project:

```
$ uv remove requests
```

## Updating Dependencies

To upgrade a package to the latest compatible version while preserving other locked versions:

```
$ uv lock --upgrade-package requests
```

This flag "will attempt to update the specified package to the latest compatible version, while keeping the rest of the lockfile intact."

## Key Files Updated

When you modify dependencies, uv automatically updates:
- **pyproject.toml** – Your project's dependency specifications
- **uv.lock** – The exact resolved versions (human-readable TOML, managed by uv)
- **Project environment** – The `.venv` folder containing installed packages

## Running Commands

The `uv run` command executes scripts within the project environment. Before each invocation, "uv will verify that the lockfile is up-to-date with the `pyproject.toml`" and synchronize the environment accordingly, ensuring consistency without manual intervention.

## Building Distributions

`uv build` generates source distributions and wheels in a `dist/` subdirectory for publishing.

## Important Note

The documentation notes that `pyproject.toml` can be edited manually or through commands like `uv add` and `uv remove` for terminal-based management.
