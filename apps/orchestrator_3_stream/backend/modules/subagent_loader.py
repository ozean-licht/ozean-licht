"""
Subagent Template Loader

Discovers, parses, and caches subagent template files from .claude/agents/ directory.
Templates are markdown files with YAML frontmatter that define specialized agent configurations.
"""

import yaml
from pathlib import Path
from typing import Dict, List, Optional
from pydantic import ValidationError

from .subagent_models import SubagentTemplate, SubagentFrontmatter
from .logger import OrchestratorLogger


def parse_subagent_file(file_path: Path, logger: OrchestratorLogger) -> Optional[SubagentTemplate]:
    """
    Parse a subagent template file with YAML frontmatter.

    Args:
        file_path: Path to the .md template file
        logger: Logger instance for debug/error messages

    Returns:
        SubagentTemplate if parsing succeeds, None otherwise

    Template format:
        ---
        name: template-name
        description: Template description
        tools: [Read, Write, Edit]
        model: sonnet
        color: blue
        ---

        # System Prompt

        Agent instructions here...
    """
    logger.debug(f"Reading template file: {file_path}")

    try:
        content = file_path.read_text(encoding='utf-8')
    except Exception as e:
        logger.error(f"Failed to read template file {file_path}: {e}")
        return None

    # Split frontmatter and body
    if not content.startswith('---'):
        logger.error(f"Template {file_path.name} missing frontmatter delimiter (should start with '---')")
        return None

    parts = content.split('---', 2)
    if len(parts) < 3:
        logger.error(f"Template {file_path.name} has incomplete frontmatter (needs two '---' delimiters)")
        return None

    frontmatter_text = parts[1].strip()
    prompt_body = parts[2].strip()

    # Parse YAML frontmatter
    try:
        frontmatter_data = yaml.safe_load(frontmatter_text)
        if not isinstance(frontmatter_data, dict):
            logger.error(f"Invalid YAML frontmatter in {file_path.name}: expected dictionary, got {type(frontmatter_data)}")
            return None
    except yaml.YAMLError as e:
        logger.error(f"Invalid YAML frontmatter in {file_path.name}: {e}")
        return None

    # Parse tools field if it's a string (comma-separated)
    if 'tools' in frontmatter_data and isinstance(frontmatter_data['tools'], str):
        # Split by comma and strip whitespace
        tools_str = frontmatter_data['tools']
        frontmatter_data['tools'] = [t.strip() for t in tools_str.split(',') if t.strip()]

    # Validate with Pydantic
    try:
        frontmatter = SubagentFrontmatter(**frontmatter_data)
    except ValidationError as e:
        logger.error(f"Template validation failed for {file_path.name}: {e}")
        return None

    # Create template instance
    try:
        template = SubagentTemplate(
            frontmatter=frontmatter,
            prompt_body=prompt_body,
            file_path=file_path
        )
        return template
    except ValidationError as e:
        logger.error(f"Template validation failed for {file_path.name}: {e}")
        return None


class SubagentRegistry:
    """
    Registry for discovering and caching subagent templates.

    Implements hierarchical loading from both root and app-specific
    .claude/agents/ directories with clear precedence rules.
    """

    def __init__(self, working_dir: str | Path, logger: OrchestratorLogger):
        """
        Initialize the subagent registry.

        Args:
            working_dir: Orchestrator working directory
            logger: Logger instance
        """
        self.working_dir = Path(working_dir)
        self.logger = logger

        # Define both root and app template directories
        self.root_templates_dir = Path("/opt/ozean-licht-ecosystem/.claude/agents")
        self.app_templates_dir = self.working_dir / ".claude" / "agents"

        self._templates: Dict[str, SubagentTemplate] = {}

        self.logger.info(f"Initializing SubagentRegistry with working_dir: {self.working_dir}")
        self.logger.info(f"Root templates directory: {self.root_templates_dir}")
        self.logger.info(f"App templates directory: {self.app_templates_dir}")

        # Discover templates immediately
        self._templates = self.discover_templates()

    def _load_templates_from_dir(self, templates_dir: Path, source: str) -> Dict[str, SubagentTemplate]:
        """
        Helper function to load templates from a specific directory.

        Args:
            templates_dir: Path to .claude/agents/ directory
            source: Source of the templates ("global" or "app")

        Returns:
            Dictionary mapping template name to SubagentTemplate
        """
        templates: Dict[str, SubagentTemplate] = {}

        # Check if directory exists
        if not templates_dir.exists():
            self.logger.debug(f"Templates directory not found: {templates_dir} (source: {source})")
            return templates

        self.logger.info(f"Scanning for templates in {templates_dir} (source: {source})")

        # Find all .md files
        template_files = list(templates_dir.glob("*.md"))

        if not template_files:
            self.logger.debug(f"No .md files found in {templates_dir} (source: {source})")
            return templates

        # Parse each template file
        valid_count = 0
        for file_path in template_files:
            self.logger.debug(f"Parsing template file: {file_path.name} (source: {source})")

            template = parse_subagent_file(file_path, self.logger)

            if template:
                # Add source metadata to the template
                template.source = source
                templates[template.frontmatter.name] = template
                valid_count += 1
                tool_count = len(template.frontmatter.tools)
                model = template.frontmatter.model or "default"
                self.logger.info(f"✓ Loaded {source} template: {template.frontmatter.name} (tools: {tool_count}, model: {model})")
            else:
                self.logger.warning(f"✗ Skipping invalid template {file_path.name} (source: {source})")

        return templates

    def discover_templates(self) -> Dict[str, SubagentTemplate]:
        """
        Discover and parse template files from both root and app-specific directories.

        Implements hierarchical loading with precedence:
        1. Load templates from root repository (/opt/ozean-licht-ecosystem/.claude/agents/)
        2. Load templates from app-specific directory (working_dir/.claude/agents/)
        3. App-specific templates override root templates with the same name

        Returns:
            Dictionary mapping template name to SubagentTemplate

        Logs:
            - Info for each successfully loaded template
            - Summary of discovery results including conflicts
        """
        import os

        # Check if hierarchical loading is enabled (default: disabled for stability)
        enable_hierarchical = os.environ.get("ENABLE_HIERARCHICAL_LOADING", "false").lower() == "true"

        if not enable_hierarchical:
            # Fall back to original single-directory loading for stability
            self.logger.info("Hierarchical loading disabled, using app-specific templates only")
            app_templates = {}
            if self.app_templates_dir.exists():
                app_templates = self._load_templates_from_dir(self.app_templates_dir, "app")
                self.logger.info(f"Loaded {len(app_templates)} app-specific agent templates")
                if app_templates:
                    names = ', '.join(sorted(app_templates.keys()))
                    self.logger.info(f"✅ Template names: {names}")
            else:
                self.logger.warning(f"⚠️  App templates directory not found: {self.app_templates_dir}")
            return app_templates

        # Hierarchical loading (when enabled)
        self.logger.info("Hierarchical loading enabled")

        # 1. Load root templates
        root_templates = {}
        try:
            if self.root_templates_dir.exists():
                root_templates = self._load_templates_from_dir(self.root_templates_dir, "global")
                self.logger.info(f"Loaded {len(root_templates)} root agent templates")
            else:
                self.logger.debug(f"Root templates directory not found: {self.root_templates_dir}")
        except Exception as e:
            self.logger.warning(f"Failed to load root templates: {e}")
            # Continue without root templates

        # 2. Load app-specific templates
        app_templates = {}
        try:
            if self.app_templates_dir.exists():
                app_templates = self._load_templates_from_dir(self.app_templates_dir, "app")
                self.logger.info(f"Loaded {len(app_templates)} app-specific agent templates")
            else:
                self.logger.debug(f"App templates directory not found: {self.app_templates_dir}")
        except Exception as e:
            self.logger.warning(f"Failed to load app templates: {e}")
            # Continue without app templates

        # 3. Merge with precedence: app-specific overrides root
        merged = dict(root_templates)  # Start with root templates

        # Track conflicts for logging
        conflicts = []
        for name, template in app_templates.items():
            if name in merged:
                conflicts.append(name)
                self.logger.info(f"App template '{name}' overriding global template")
            merged[name] = template

        if conflicts:
            self.logger.info(f"App-specific templates overriding root templates: {', '.join(conflicts)}")

        # Summary
        if merged:
            names = ', '.join(sorted(merged.keys()))
            self.logger.info(f"✅ Total templates available: {len(merged)} ({len(root_templates)} global + {len(app_templates)} app - {len(conflicts)} duplicates)")
            self.logger.info(f"✅ Template names: {names}")
        else:
            self.logger.warning(f"⚠️  No valid templates found in either directory")
            self.logger.warning("💡 Create .claude/agents/ directory and add *.md template files to enable specialized agents")

        return merged

    def get_template(self, name: str) -> Optional[SubagentTemplate]:
        """
        Retrieve a template by name.

        Args:
            name: Template name to look up

        Returns:
            SubagentTemplate if found, None otherwise
        """
        template = self._templates.get(name)
        if not template:
            self.logger.debug(f"Template '{name}' not found in registry")
        return template

    def list_templates(self) -> List[Dict[str, str]]:
        """
        List all available templates with names and descriptions.

        Returns:
            List of dicts with 'name' and 'description' keys
        """
        return [
            {"name": t.frontmatter.name, "description": t.frontmatter.description}
            for t in self._templates.values()
        ]

    def get_available_names(self) -> List[str]:
        """
        Get sorted list of available template names.

        Returns:
            Sorted list of template names
        """
        return sorted(self._templates.keys())

    def has_templates(self) -> bool:
        """Check if any templates are available."""
        return len(self._templates) > 0
