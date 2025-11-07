# Running Scripts with uv

## Core Concept

This guide explains how to use `uv` to execute Python scripts while automatically managing their dependencies and environments, eliminating the need for manual virtual environment setup.

## Scripts Without Dependencies

You can execute simple scripts using `uv run <script>.py`. Scripts using only the standard library work immediately without additional configuration.

Scripts accept input via stdin:
```bash
echo 'print("hello world!")' | uv run -
```

Arguments pass through directly to the script.

## Scripts With Dependencies

For scripts requiring external packages, `uv` supports multiple approaches:

### Command-line Specification

Use the `--with` flag to request dependencies per invocation:

```bash
uv run --with rich example.py
```

You can also specify version constraints:

```bash
uv run --with 'rich>12,<13' example.py
```

### Inline Script Metadata (PEP 723)

The recommended approach uses a script preamble with inline metadata. Modern Python supports declaring dependencies directly in scripts using TOML blocks:

```python
# /// script
# dependencies = ["requests<3", "rich"]
# requires-python = ">=3.12"
# ///

import requests
from rich.console import Console
```

Initialize a script with metadata:
```bash
uv init --script example.py --python 3.12
```

Add dependencies to an existing script:
```bash
uv add --script example.py 'requests<3' 'rich'
```

### Project-based Approach

Store dependencies in a `pyproject.toml` file for more complex scenarios.

## Advanced Features

### Executable Scripts

Make scripts directly executable using shebangs:

```bash
#!/usr/bin/env -S uv run --script
```

This allows running scripts directly without explicitly calling `uv run`:
```bash
./example.py
```

### Reproducibility

Create reproducible environments by locking dependencies:

```bash
uv lock --script example.py
```

Limit distribution dates via the `exclude-newer` field in the script metadata to ensure reproducible dependency resolution.

### Python Version Selection

Request specific Python versions per invocation:

```bash
uv run --python 3.10 example.py
```

Alternatively, specify the required Python version in the script metadata:

```python
# /// script
# requires-python = ">=3.12"
# ///
```

### GUI Scripts

Windows supports `.pyw` files which run with `pythonw` instead of the standard Python executable, allowing GUI applications to run without a console window.

### Alternative Package Indexes

Specify custom package repositories when needed:

```bash
uv add --index "https://example.com/simple" --script example.py
```

## Key Commands Reference

- `uv run example.py` - Execute a script
- `uv run --with package example.py` - Execute with specific dependencies
- `uv init --script example.py` - Initialize a script with metadata
- `uv add --script example.py 'package'` - Declare dependencies in a script
- `uv lock --script example.py` - Create a lock file for reproducibility
- `uv run --python 3.10 example.py` - Use specific Python version
