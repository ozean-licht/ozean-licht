#!/bin/bash
source "$(dirname "$0")/../templates/shared.sh"

print_header "Database Tools - 8 commands"
cat << 'COMMANDS'
║                                            ║
║ ⚡ Common Workflows:                       ║
║   Backup workflow:                         ║
║     bash tools/database/backup.sh kids_ascension_db /backups/ka.sql ║
║     bash tools/database/size.sh kids_ascension_db ║
║                                            ║
║ 📋 Available Commands:                     ║
║                                            ║
║ backup.sh <db_name> <output_file>         ║
║   Backup database to SQL file              ║
║   Example: bash tools/database/backup.sh kids_ascension_db /backups/ka.sql ║
║                                            ║
║ restore.sh <db_name> <input_file>         ║
║   Restore database from SQL file           ║
║   Example: bash tools/database/restore.sh kids_ascension_db /backups/ka.sql ║
║                                            ║
║ size.sh [db_name]                         ║
║   Check database size                      ║
║   Example: bash tools/database/size.sh kids_ascension_db ║
║                                            ║
║ connections.sh [db_name]                  ║
║   Show active connections                  ║
║   Example: bash tools/database/connections.sh ║
║                                            ║
║ query.sh <db_name> <query>                ║
║   Execute SQL query                        ║
║   Example: bash tools/database/query.sh kids_ascension_db "SELECT * FROM users LIMIT 5" ║
COMMANDS
print_footer
echo ""
print_success_rate "database" "postgres"
echo ""
print_navigation "/ → database" "tools/discover.sh" "[command].sh"
save_navigation "tools/database/list.sh"
