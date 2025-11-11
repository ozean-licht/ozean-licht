#!/bin/bash
# ssh.sh - SSH operations wrapper
# Version: 1.0.0
# Description: Remote command execution, file transfer, and SSH tunneling

# Source shared utilities
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/utils.sh"

# Tool configuration
TOOL_NAME="ssh"
SSH_KEY_PATH="${SSH_KEY_PATH:-$HOME/.ssh/id_rsa}"
SSH_HOST="${SSH_HOST:-}"
SSH_USER="${SSH_USER:-root}"
SSH_PORT="${SSH_PORT:-22}"

# Check dependencies
require_command "ssh"
require_command "scp"

#######################################
# Execute Remote Command
#######################################

exec_remote() {
    local command="$*"

    if [[ -z "$command" ]]; then
        handle_error 1 "Command required"
    fi

    if [[ -z "$SSH_HOST" ]]; then
        handle_error 1 "SSH_HOST environment variable not set"
    fi

    log_info "Executing remote command on ${SSH_USER}@${SSH_HOST}"
    log_debug "Command: $command"

    execute_and_record "$TOOL_NAME" ssh -i "$SSH_KEY_PATH" \
        -o StrictHostKeyChecking=no \
        -o ConnectTimeout=10 \
        -p "$SSH_PORT" \
        "${SSH_USER}@${SSH_HOST}" \
        "$command"

    local exit_code=$?

    if [[ $exit_code -eq 0 ]]; then
        log_success "Remote command executed successfully"
    else
        log_error "Remote command failed (exit code: $exit_code)"
    fi

    return $exit_code
}

#######################################
# Upload File
#######################################

file_upload() {
    local local_path="$1"
    local remote_path="$2"

    if [[ -z "$local_path" ]] || [[ -z "$remote_path" ]]; then
        handle_error 1 "Usage: file_upload <local_path> <remote_path>"
    fi

    if [[ ! -f "$local_path" ]] && [[ ! -d "$local_path" ]]; then
        handle_error 1 "Local path not found: $local_path"
    fi

    if [[ -z "$SSH_HOST" ]]; then
        handle_error 1 "SSH_HOST environment variable not set"
    fi

    log_info "Uploading: $local_path -> ${SSH_USER}@${SSH_HOST}:$remote_path"

    local scp_opts="-i $SSH_KEY_PATH -o StrictHostKeyChecking=no -P $SSH_PORT"

    if [[ -d "$local_path" ]]; then
        scp_opts="$scp_opts -r"
    fi

    execute_and_record "$TOOL_NAME" scp $scp_opts "$local_path" "${SSH_USER}@${SSH_HOST}:$remote_path"

    local exit_code=$?

    if [[ $exit_code -eq 0 ]]; then
        log_success "Upload completed"
    else
        log_error "Upload failed"
    fi

    return $exit_code
}

#######################################
# Download File
#######################################

file_download() {
    local remote_path="$1"
    local local_path="$2"

    if [[ -z "$remote_path" ]] || [[ -z "$local_path" ]]; then
        handle_error 1 "Usage: file_download <remote_path> <local_path>"
    fi

    if [[ -z "$SSH_HOST" ]]; then
        handle_error 1 "SSH_HOST environment variable not set"
    fi

    log_info "Downloading: ${SSH_USER}@${SSH_HOST}:$remote_path -> $local_path"

    execute_and_record "$TOOL_NAME" scp \
        -i "$SSH_KEY_PATH" \
        -o StrictHostKeyChecking=no \
        -P "$SSH_PORT" \
        -r \
        "${SSH_USER}@${SSH_HOST}:$remote_path" \
        "$local_path"

    local exit_code=$?

    if [[ $exit_code -eq 0 ]]; then
        log_success "Download completed"
    else
        log_error "Download failed"
    fi

    return $exit_code
}

#######################################
# Create SSH Tunnel
#######################################

tunnel_create() {
    local local_port="$1"
    local remote_port="$2"
    local remote_host="${3:-localhost}"

    if [[ -z "$local_port" ]] || [[ -z "$remote_port" ]]; then
        handle_error 1 "Usage: tunnel_create <local_port> <remote_port> [remote_host]"
    fi

    if [[ -z "$SSH_HOST" ]]; then
        handle_error 1 "SSH_HOST environment variable not set"
    fi

    log_info "Creating SSH tunnel: localhost:$local_port -> $remote_host:$remote_port (via ${SSH_HOST})"

    ssh -i "$SSH_KEY_PATH" \
        -o StrictHostKeyChecking=no \
        -p "$SSH_PORT" \
        -N -L "${local_port}:${remote_host}:${remote_port}" \
        "${SSH_USER}@${SSH_HOST}" &

    local pid=$!

    # Save tunnel PID for later cleanup
    echo "$pid" > "/tmp/ssh-tunnel-${local_port}.pid"

    log_success "SSH tunnel created (PID: $pid)"
    log_info "Access via: localhost:$local_port"
    log_info "To close tunnel: kill $pid"

    return 0
}

#######################################
# Close SSH Tunnel
#######################################

tunnel_close() {
    local local_port="$1"

    if [[ -z "$local_port" ]]; then
        handle_error 1 "Local port required"
    fi

    local pid_file="/tmp/ssh-tunnel-${local_port}.pid"

    if [[ ! -f "$pid_file" ]]; then
        log_warning "No tunnel found for port: $local_port"
        return 1
    fi

    local pid=$(cat "$pid_file")

    log_info "Closing SSH tunnel on port: $local_port (PID: $pid)"

    if kill "$pid" 2>/dev/null; then
        rm -f "$pid_file"
        log_success "Tunnel closed"
        return 0
    else
        log_error "Failed to close tunnel (process may have already exited)"
        rm -f "$pid_file"
        return 1
    fi
}

#######################################
# List Active Tunnels
#######################################

tunnel_list() {
    log_info "Listing active SSH tunnels"

    echo ""
    echo "Active SSH Tunnels:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    local found=false

    for pid_file in /tmp/ssh-tunnel-*.pid; do
        if [[ -f "$pid_file" ]]; then
            local port=$(basename "$pid_file" .pid | sed 's/ssh-tunnel-//')
            local pid=$(cat "$pid_file")

            if ps -p "$pid" > /dev/null 2>&1; then
                printf "  Port %-6s  PID: %s\n" "$port" "$pid"
                found=true
            else
                log_debug "Removing stale tunnel PID file: $pid_file"
                rm -f "$pid_file"
            fi
        fi
    done

    if [[ "$found" == "false" ]]; then
        echo "  No active tunnels"
    fi

    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

#######################################
# Test Connection
#######################################

test_connection() {
    local host="${1:-$SSH_HOST}"
    local user="${2:-$SSH_USER}"
    local port="${3:-$SSH_PORT}"

    if [[ -z "$host" ]]; then
        handle_error 1 "SSH host required"
    fi

    log_info "Testing SSH connection to ${user}@${host}:${port}"

    if ssh -i "$SSH_KEY_PATH" \
        -o StrictHostKeyChecking=no \
        -o ConnectTimeout=5 \
        -p "$port" \
        "${user}@${host}" \
        "echo 'Connection successful'" &>/dev/null; then

        log_success "✓ SSH connection successful"
        return 0
    else
        log_error "✗ SSH connection failed"
        return 1
    fi
}

#######################################
# Interactive Shell
#######################################

interactive_shell() {
    local host="${1:-$SSH_HOST}"
    local user="${2:-$SSH_USER}"
    local port="${3:-$SSH_PORT}"

    if [[ -z "$host" ]]; then
        handle_error 1 "SSH host required"
    fi

    log_info "Opening interactive shell to ${user}@${host}"

    ssh -i "$SSH_KEY_PATH" \
        -o StrictHostKeyChecking=no \
        -p "$port" \
        "${user}@${host}"
}

#######################################
# Sync Directory (rsync)
#######################################

sync_directory() {
    local source="$1"
    local destination="$2"
    local direction="${3:-upload}"

    if [[ -z "$source" ]] || [[ -z "$destination" ]]; then
        handle_error 1 "Usage: sync_directory <source> <destination> [upload|download]"
    fi

    require_command "rsync"

    if [[ -z "$SSH_HOST" ]]; then
        handle_error 1 "SSH_HOST environment variable not set"
    fi

    if [[ "$direction" == "upload" ]]; then
        log_info "Syncing directory: $source -> ${SSH_USER}@${SSH_HOST}:$destination"
        local target="${SSH_USER}@${SSH_HOST}:$destination"
        local source_path="$source"
    else
        log_info "Syncing directory: ${SSH_USER}@${SSH_HOST}:$source -> $destination"
        local source_path="${SSH_USER}@${SSH_HOST}:$source"
        local target="$destination"
    fi

    execute_and_record "$TOOL_NAME" rsync -avz \
        -e "ssh -i $SSH_KEY_PATH -o StrictHostKeyChecking=no -p $SSH_PORT" \
        --progress \
        "$source_path" \
        "$target"

    local exit_code=$?

    if [[ $exit_code -eq 0 ]]; then
        log_success "Directory sync completed"
    else
        log_error "Directory sync failed"
    fi

    return $exit_code
}

#######################################
# Main Function
#######################################

main() {
    local operation="${1:-help}"
    shift || true

    case "$operation" in
        exec_remote)
            exec_remote "$@"
            ;;
        file_upload)
            file_upload "$@"
            ;;
        file_download)
            file_download "$@"
            ;;
        tunnel_create)
            tunnel_create "$@"
            ;;
        tunnel_close)
            tunnel_close "$@"
            ;;
        tunnel_list)
            tunnel_list "$@"
            ;;
        test_connection)
            test_connection "$@"
            ;;
        interactive_shell)
            interactive_shell "$@"
            ;;
        sync_directory)
            sync_directory "$@"
            ;;
        help|--help|-h)
            cat <<EOF
SSH Operations Script - Remote Execution and File Transfer
Version: 1.0.0

Usage: $0 <operation> [arguments]

Operations:
  exec_remote <command>                     Execute command on remote server
  file_upload <local> <remote>              Upload file/directory to server
  file_download <remote> <local>            Download file/directory from server
  tunnel_create <local_port> <remote_port> [host]  Create SSH tunnel
  tunnel_close <local_port>                 Close SSH tunnel
  tunnel_list                               List active tunnels
  test_connection [host] [user] [port]      Test SSH connection
  interactive_shell [host] [user] [port]    Open interactive SSH session
  sync_directory <source> <dest> [direction] Sync directory (upload|download)
  help                                      Show this help message

Examples:
  # Remote execution
  $0 exec_remote "docker ps"
  $0 exec_remote "systemctl status nginx"

  # File transfer
  $0 file_upload ./config.json /opt/app/config.json
  $0 file_download /var/log/app.log ./app.log

  # SSH tunnels
  $0 tunnel_create 9200 9200
  $0 tunnel_list
  $0 tunnel_close 9200

  # Connection test
  $0 test_connection

  # Interactive shell
  $0 interactive_shell

  # Directory sync
  $0 sync_directory ./local-dir /remote/path upload
  $0 sync_directory /remote/path ./local-dir download

Environment Variables:
  SSH_HOST        Remote server hostname/IP (required)
  SSH_USER        SSH username (default: root)
  SSH_PORT        SSH port (default: 22)
  SSH_KEY_PATH    SSH private key path (default: ~/.ssh/id_rsa)

Examples:
  export SSH_HOST="138.201.139.25"
  export SSH_USER="root"
  export SSH_KEY_PATH="~/.ssh/ozean-automation"

  $0 exec_remote "docker ps"

EOF
            ;;
        *)
            log_error "Unknown operation: $operation"
            echo "Run '$0 help' for usage information"
            exit 1
            ;;
    esac
}

# Run main function if script is executed (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
