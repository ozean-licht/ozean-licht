#!/bin/bash
# Memory Tools - Command list
# Version: 1.0.0

source "$(dirname "$0")/../templates/shared.sh"

print_header "Memory Tools - 8 commands"

cat << 'COMMANDS'
║                                            ║
║ ⚡ Common Workflows:                       ║
║   Search then save pattern:                ║
║     bash tools/memory/search.sh "topic" && ║
║     bash tools/memory/save.sh "pattern"    ║
║                                            ║
║   Save with category:                      ║
║     bash tools/memory/save.sh "content" \  ║
║       --category=pattern                   ║
║                                            ║
║   View patterns by type:                   ║
║     bash tools/memory/patterns.sh \        ║
║       --category=solution                  ║
║                                            ║
║ 📋 Available Commands:                     ║
║                                            ║
║ save.sh <content> [--category=type]       ║
║   Save a new memory/pattern                ║
║   Example: bash tools/memory/save.sh \     ║
║     "Use connection pooling for DB" \      ║
║     --category=pattern                     ║
║   Add --explain for detailed info          ║
║                                            ║
║ search.sh <query> [--limit=N]             ║
║   Semantic search through memories         ║
║   Example: bash tools/memory/search.sh \   ║
║     "database connection" --limit=5        ║
║   Add --explain for detailed info          ║
║                                            ║
║ get.sh <user_id> [--limit=N]              ║
║   Get all memories for user/agent          ║
║   Example: bash tools/memory/get.sh \      ║
║     agent_claude_code                      ║
║   Add --explain for detailed info          ║
║                                            ║
║ patterns.sh [--category=type]             ║
║   List patterns by category                ║
║   Example: bash tools/memory/patterns.sh \ ║
║     --category=solution                    ║
║   Add --explain for detailed info          ║
║                                            ║
║ stats.sh                                  ║
║   Show memory usage statistics             ║
║   Example: bash tools/memory/stats.sh      ║
║   Add --explain for detailed info          ║
║                                            ║
║ health.sh                                 ║
║   Check Mem0 service health                ║
║   Example: bash tools/memory/health.sh     ║
║   Add --explain for detailed info          ║
║                                            ║
║ delete.sh <memory_id>                     ║
║   Delete specific memory                   ║
║   Example: bash tools/memory/delete.sh \   ║
║     mem_abc123                             ║
║   Add --explain for detailed info          ║
║                                            ║
║ update.sh <memory_id> <new_content>      ║
║   Update existing memory                   ║
║   Example: bash tools/memory/update.sh \   ║
║     mem_abc123 "Updated content"           ║
║   Add --explain for detailed info          ║
║                                            ║
║ 🏷️  Pattern Categories:                    ║
║   • pattern   - Reusable implementations   ║
║   • decision  - Architecture choices       ║
║   • solution  - Problem-solution pairs     ║
║   • error     - Error resolutions          ║
║   • workflow  - Successful sequences       ║
COMMANDS

print_footer

echo ""
print_success_rate "mem0" "memory"
echo ""

print_navigation "/ → memory" "tools/discover.sh" "[command].sh or [command].sh --explain"

save_navigation "tools/memory/list.sh"
