#!/usr/bin/env python3
"""
Migration script for o-commands/a-commands architecture separation.

This script migrates the current flat .claude/commands/ structure to:
- .claude/o-commands/ - Orchestrator-specific commands
- .claude/a-commands/ - General agent commands
- Symlinks for backward compatibility

Preserves git history using git mv.
"""

import os
import subprocess
import sys
from pathlib import Path
from typing import List, Set

# Command categorization based on functionality
O_COMMANDS = {
    "orch_scout_and_build",
    "orch_one_shot_agent",
    "orch_plan_w_scouts_build_review",
    "orch_trinity_mode",
    "build_in_parallel",
    "plan_w_scouters",
    "parallel_subagents",
}

A_COMMANDS = {
    "plan",
    "build",
    "prime",
    "prime_3",
    "prime_cc",
    "question",
    "quick-plan",
    "find_and_summarize",
    "load_ai_docs",
    "load_bundle",
    "all_tools",
    "t_metaprompt_workflow",
    "reset",
}


class CommandMigrator:
    """Handles the migration of commands to new structure."""

    def __init__(self, dry_run: bool = False):
        self.dry_run = dry_run
        self.root = Path("/opt/ozean-licht-ecosystem")
        self.commands_dir = self.root / ".claude" / "commands"
        self.o_commands_dir = self.root / ".claude" / "o-commands"
        self.a_commands_dir = self.root / ".claude" / "a-commands"
        self.orchestrator_commands = self.root / "apps" / "orchestrator_3_stream" / ".claude" / "commands"

    def log(self, message: str, level: str = "INFO"):
        """Log a message with level."""
        prefix = "🔷" if level == "INFO" else "⚠️" if level == "WARN" else "❌" if level == "ERROR" else "✅"
        print(f"{prefix} {message}")

    def run_command(self, cmd: List[str], check: bool = True) -> subprocess.CompletedProcess:
        """Run a shell command."""
        if self.dry_run:
            self.log(f"DRY RUN: {' '.join(cmd)}", "INFO")
            return subprocess.CompletedProcess(cmd, 0, "", "")

        self.log(f"Running: {' '.join(cmd)}", "INFO")
        result = subprocess.run(cmd, capture_output=True, text=True, check=False)

        if check and result.returncode != 0:
            self.log(f"Command failed: {result.stderr}", "ERROR")
            raise RuntimeError(f"Command failed: {' '.join(cmd)}")

        return result

    def validate_current_structure(self) -> bool:
        """Validate the current command structure."""
        self.log("Validating current structure...", "INFO")

        if not self.commands_dir.exists():
            self.log(f"Commands directory not found: {self.commands_dir}", "ERROR")
            return False

        # Get all command files
        command_files = set(f.stem for f in self.commands_dir.glob("*.md"))

        # Check all categorized commands exist
        all_categorized = O_COMMANDS | A_COMMANDS
        missing = all_categorized - command_files

        if missing:
            self.log(f"Missing expected commands: {missing}", "ERROR")
            return False

        uncategorized = command_files - all_categorized
        if uncategorized:
            self.log(f"Uncategorized commands found: {uncategorized}", "WARN")
            self.log("These will NOT be migrated!", "WARN")

        self.log(f"✓ Found {len(command_files)} commands", "SUCCESS")
        self.log(f"  - {len(O_COMMANDS)} o-commands", "INFO")
        self.log(f"  - {len(A_COMMANDS)} a-commands", "INFO")

        return True

    def create_directories(self):
        """Create the new directory structure."""
        self.log("Creating new directory structure...", "INFO")

        for directory in [self.o_commands_dir, self.a_commands_dir]:
            if not self.dry_run:
                directory.mkdir(parents=True, exist_ok=True)
            self.log(f"Created: {directory.relative_to(self.root)}", "SUCCESS")

    def migrate_commands(self):
        """Migrate commands using git mv to preserve history."""
        self.log("Migrating commands with git mv...", "INFO")

        # Migrate o-commands
        for cmd in sorted(O_COMMANDS):
            src = self.commands_dir / f"{cmd}.md"
            dst = self.o_commands_dir / f"{cmd}.md"

            if not src.exists():
                self.log(f"Skipping missing file: {cmd}.md", "WARN")
                continue

            self.run_command(["git", "mv", str(src), str(dst)])
            self.log(f"Moved {cmd}.md → o-commands/", "SUCCESS")

        # Migrate a-commands
        for cmd in sorted(A_COMMANDS):
            src = self.commands_dir / f"{cmd}.md"
            dst = self.a_commands_dir / f"{cmd}.md"

            if not src.exists():
                self.log(f"Skipping missing file: {cmd}.md", "WARN")
                continue

            self.run_command(["git", "mv", str(src), str(dst)])
            self.log(f"Moved {cmd}.md → a-commands/", "SUCCESS")

    def create_symlinks(self):
        """Create symlinks for backward compatibility."""
        self.log("Creating symlinks for backward compatibility...", "INFO")

        # Symlink .claude/commands → a-commands (for root context)
        commands_symlink = self.commands_dir
        if not self.dry_run:
            if commands_symlink.exists() or commands_symlink.is_symlink():
                if commands_symlink.is_symlink():
                    commands_symlink.unlink()
                elif commands_symlink.is_dir() and not any(commands_symlink.iterdir()):
                    commands_symlink.rmdir()

            commands_symlink.symlink_to("a-commands", target_is_directory=True)

        self.log("Created: .claude/commands → a-commands", "SUCCESS")

        # Symlink orchestrator commands → o-commands
        if not self.dry_run:
            if self.orchestrator_commands.exists() or self.orchestrator_commands.is_symlink():
                if self.orchestrator_commands.is_symlink():
                    self.orchestrator_commands.unlink()
                elif self.orchestrator_commands.is_dir():
                    # Backup existing orchestrator commands if different
                    backup_dir = self.orchestrator_commands.parent / "commands.backup"
                    if not backup_dir.exists():
                        self.run_command([
                            "mv",
                            str(self.orchestrator_commands),
                            str(backup_dir)
                        ])
                        self.log(f"Backed up orchestrator commands to: {backup_dir}", "INFO")

            # Create relative symlink
            rel_path = os.path.relpath(self.o_commands_dir, self.orchestrator_commands.parent)
            self.orchestrator_commands.symlink_to(rel_path, target_is_directory=True)

        self.log("Created: orchestrator/.claude/commands → o-commands", "SUCCESS")

    def verify_structure(self) -> bool:
        """Verify the new structure is correct."""
        self.log("Verifying new structure...", "INFO")

        if self.dry_run:
            self.log("Skipping verification in dry-run mode", "INFO")
            return True

        # Check directories exist
        if not self.o_commands_dir.exists():
            self.log(f"o-commands directory not found: {self.o_commands_dir}", "ERROR")
            return False

        if not self.a_commands_dir.exists():
            self.log(f"a-commands directory not found: {self.a_commands_dir}", "ERROR")
            return False

        # Check command counts
        o_count = len(list(self.o_commands_dir.glob("*.md")))
        a_count = len(list(self.a_commands_dir.glob("*.md")))

        if o_count != len(O_COMMANDS):
            self.log(f"Expected {len(O_COMMANDS)} o-commands, found {o_count}", "ERROR")
            return False

        if a_count != len(A_COMMANDS):
            self.log(f"Expected {len(A_COMMANDS)} a-commands, found {a_count}", "ERROR")
            return False

        # Check symlinks
        if not self.commands_dir.is_symlink():
            self.log(f".claude/commands is not a symlink", "ERROR")
            return False

        if not self.orchestrator_commands.is_symlink():
            self.log(f"orchestrator commands is not a symlink", "ERROR")
            return False

        self.log("✓ Structure verification passed", "SUCCESS")
        self.log(f"  - {o_count} files in o-commands/", "INFO")
        self.log(f"  - {a_count} files in a-commands/", "INFO")
        self.log(f"  - Symlinks created successfully", "INFO")

        return True

    def run_migration(self) -> bool:
        """Execute the complete migration."""
        self.log("=" * 80, "INFO")
        self.log("STARTING COMMAND MIGRATION", "INFO")
        self.log("=" * 80, "INFO")

        if self.dry_run:
            self.log("DRY RUN MODE - No changes will be made", "WARN")

        try:
            # Step 1: Validate current structure
            if not self.validate_current_structure():
                return False

            # Step 2: Create new directories
            self.create_directories()

            # Step 3: Migrate commands
            self.migrate_commands()

            # Step 4: Create symlinks
            self.create_symlinks()

            # Step 5: Verify structure
            if not self.verify_structure():
                return False

            self.log("=" * 80, "INFO")
            self.log("MIGRATION COMPLETED SUCCESSFULLY", "SUCCESS")
            self.log("=" * 80, "INFO")

            return True

        except Exception as e:
            self.log(f"Migration failed: {e}", "ERROR")
            import traceback
            traceback.print_exc()
            return False


def main():
    """Main entry point."""
    import argparse

    parser = argparse.ArgumentParser(description="Migrate commands to o-commands/a-commands structure")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be done without making changes")
    parser.add_argument("--force", action="store_true", help="Force migration even if validation fails")

    args = parser.parse_args()

    migrator = CommandMigrator(dry_run=args.dry_run)
    success = migrator.run_migration()

    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
