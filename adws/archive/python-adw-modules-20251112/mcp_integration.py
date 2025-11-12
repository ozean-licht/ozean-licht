"""
MCP Gateway Integration for ADW System
Connects ADW agents to MCP tools for unified tool access
"""

import os
import json
import asyncio
from typing import Dict, Any, List, Optional
from pathlib import Path
import httpx
from dataclasses import dataclass
from datetime import datetime

# Import Claude SDK if available
try:
    from claude_code_sdk import query, ClaudeCodeOptions, Message
    CLAUDE_SDK_AVAILABLE = True
except ImportError:
    print("Warning: claude_code_sdk not available. Install with: pip install claude-code-sdk")
    CLAUDE_SDK_AVAILABLE = False

@dataclass
class MCPToolCall:
    """Represents an MCP tool call."""
    service: str
    command: str
    parameters: Dict[str, Any]
    timestamp: datetime
    result: Optional[Any] = None

class MCPGateway:
    """MCP Gateway client for ADW system."""

    def __init__(self):
        """Initialize MCP Gateway configuration."""
        self.services = {
            "postgres": {
                "endpoint": "mcp-postgres",
                "databases": {
                    "kids-ascension": "iccc0wo0wkgsws4cowk4440c",
                    "ozean-licht": "zo8g4ogg8g0gss0oswkcs84w"
                }
            },
            "mem0": {
                "endpoint": "http://mem0.ozean-licht.dev:8090",
                "api_prefix": "/memory"
            },
            "github": {
                "endpoint": "mcp-github",
                "token_env": "GITHUB_PAT"
            },
            "n8n": {
                "endpoint": "http://n8n.ozean-licht.dev:5678",
                "api_prefix": "/api/v1"
            },
            "qdrant": {
                "endpoint": "http://qdrant.ozean-licht.dev:6333",
                "collection": "ozean_memories"
            },
            "cloudflare": {
                "endpoint": "mcp-cloudflare",
                "zones": ["ozean-licht.dev", "kids-ascension.dev"]
            }
        }

    async def remember(self, content: str, agent_id: str = "adw_system", metadata: Dict = None) -> Dict:
        """Store a memory in Mem0."""
        async with httpx.AsyncClient() as client:
            payload = {
                "user_id": agent_id,
                "content": content,
                "metadata": metadata or {
                    "type": "adw_learning",
                    "timestamp": datetime.utcnow().isoformat()
                }
            }
            response = await client.post(
                f"{self.services['mem0']['endpoint']}{self.services['mem0']['api_prefix']}/add",
                json=payload
            )
            return response.json()

    async def search_memory(self, query: str, agent_id: str = "adw_system") -> List[Dict]:
        """Search memories in Mem0."""
        async with httpx.AsyncClient() as client:
            payload = {"query": query, "user_id": agent_id}
            response = await client.post(
                f"{self.services['mem0']['endpoint']}{self.services['mem0']['api_prefix']}/search",
                json=payload
            )
            return response.json()

    async def query_database(self, database: str, query: str) -> Dict:
        """Execute a database query through MCP."""
        # This would integrate with the actual MCP postgres service
        # For now, returning a placeholder
        return {
            "service": "postgres",
            "database": database,
            "query": query,
            "note": "Integrate with actual MCP postgres service"
        }

    async def create_github_pr(self, title: str, body: str, branch: str) -> Dict:
        """Create a GitHub pull request through MCP."""
        # This would integrate with the actual MCP github service
        return {
            "service": "github",
            "action": "create_pr",
            "title": title,
            "body": body,
            "branch": branch,
            "note": "Integrate with actual MCP github service"
        }

    async def trigger_n8n_workflow(self, workflow_id: str, data: Dict) -> Dict:
        """Trigger an N8N workflow."""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.services['n8n']['endpoint']}{self.services['n8n']['api_prefix']}/workflows/{workflow_id}/execute",
                json=data
            )
            return response.json()


class MCPEnabledADW:
    """ADW system with MCP Gateway integration."""

    def __init__(self, adw_id: str, issue_number: int):
        """Initialize MCP-enabled ADW agent."""
        self.adw_id = adw_id
        self.issue_number = issue_number
        self.mcp_gateway = MCPGateway()
        self.mcp_config = self._build_mcp_config()

    def _build_mcp_config(self) -> Dict:
        """Build MCP configuration for Claude SDK."""
        return {
            "mcpServers": {
                "postgres": {
                    "command": "npx",
                    "args": [
                        "-y",
                        "@modelcontextprotocol/server-postgres",
                        "--connection-string",
                        f"postgresql://postgres@localhost:5432"
                    ]
                },
                "github": {
                    "command": "npx",
                    "args": ["-y", "@modelcontextprotocol/server-github"],
                    "env": {
                        "GITHUB_TOKEN": os.environ.get("GITHUB_PAT", "")
                    }
                },
                "filesystem": {
                    "command": "npx",
                    "args": [
                        "-y",
                        "@modelcontextprotocol/server-filesystem",
                        str(Path.cwd())
                    ]
                }
            }
        }

    async def plan_with_mcp(self, issue_description: str) -> Dict:
        """Plan implementation using MCP tools."""
        # Search for similar past implementations
        memories = await self.mcp_gateway.search_memory(issue_description)

        # Build context from memories
        context = "\n".join([m.get("content", "") for m in memories[:5]])

        prompt = f"""
        Plan implementation for issue #{self.issue_number}:
        {issue_description}

        Past similar implementations:
        {context}

        Use MCP tools to:
        1. Query database schema if needed
        2. Search for code patterns
        3. Create detailed implementation plan
        """

        if CLAUDE_SDK_AVAILABLE:
            options = ClaudeCodeOptions(
                mcp_config=self.mcp_config,
                allowed_tools=[
                    "mcp__postgres__query",
                    "mcp__github__list_issues",
                    "mcp__filesystem__read_file"
                ],
                max_turns=5
            )

            messages = []
            async for message in query(prompt=prompt, options=options):
                messages.append(message)

            # Store the plan as a learning
            plan_content = "\n".join([str(m) for m in messages])
            await self.mcp_gateway.remember(
                f"Plan for issue #{self.issue_number}: {plan_content}",
                agent_id=f"adw_{self.adw_id}"
            )

            return {"status": "success", "messages": messages}
        else:
            return {"status": "sdk_not_available", "prompt": prompt}

    async def implement_with_mcp(self, plan_file: str) -> Dict:
        """Implement based on plan using MCP tools."""
        # Read the plan
        with open(plan_file, 'r') as f:
            plan = f.read()

        prompt = f"""
        Implement the following plan:
        {plan}

        Use MCP tools to:
        1. Query database for current schema
        2. Implement the feature
        3. Store learnings about the implementation
        """

        if CLAUDE_SDK_AVAILABLE:
            options = ClaudeCodeOptions(
                mcp_config=self.mcp_config,
                allowed_tools=[
                    "mcp__postgres__query",
                    "mcp__filesystem__write_file",
                    "mcp__filesystem__read_file"
                ],
                max_turns=10
            )

            messages = []
            async for message in query(prompt=prompt, options=options):
                messages.append(message)

            # Store implementation learning
            await self.mcp_gateway.remember(
                f"Implementation for issue #{self.issue_number} completed",
                agent_id=f"adw_{self.adw_id}",
                metadata={"type": "implementation", "issue": self.issue_number}
            )

            return {"status": "success", "messages": messages}
        else:
            return {"status": "sdk_not_available", "prompt": prompt}

    async def create_pr_with_mcp(self, branch: str, changes_summary: str) -> Dict:
        """Create a pull request using MCP GitHub service."""
        title = f"feat: Implement issue #{self.issue_number} ({self.adw_id})"

        body = f"""
        ## Summary
        Automated implementation for issue #{self.issue_number}

        ## Changes
        {changes_summary}

        ## ADW Details
        - ADW ID: {self.adw_id}
        - Automated: Yes
        - MCP Tools Used: postgres, filesystem, mem0

        ---
        Generated by ADW System with MCP Gateway
        """

        result = await self.mcp_gateway.create_github_pr(title, body, branch)

        # Store PR creation as learning
        await self.mcp_gateway.remember(
            f"Created PR for issue #{self.issue_number}: {title}",
            agent_id=f"adw_{self.adw_id}",
            metadata={"type": "pr_creation", "branch": branch}
        )

        return result

    async def cleanup(self):
        """Clean up resources and store final learnings."""
        await self.mcp_gateway.remember(
            f"ADW {self.adw_id} completed work on issue #{self.issue_number}",
            agent_id=f"adw_{self.adw_id}",
            metadata={
                "type": "completion",
                "timestamp": datetime.utcnow().isoformat()
            }
        )


# Utility functions for ADW scripts
def get_mcp_tools_for_phase(phase: str) -> List[str]:
    """Get appropriate MCP tools for each ADW phase."""
    tools_by_phase = {
        "plan": [
            "mcp__postgres__list_tables",
            "mcp__postgres__describe_table",
            "mcp__github__list_issues",
            "mcp__mem0__search"
        ],
        "build": [
            "mcp__filesystem__write_file",
            "mcp__filesystem__read_file",
            "mcp__postgres__query",
            "mcp__mem0__remember"
        ],
        "test": [
            "mcp__playwright__navigate",
            "mcp__playwright__screenshot",
            "mcp__filesystem__read_file"
        ],
        "review": [
            "mcp__filesystem__read_file",
            "mcp__github__create_comment",
            "mcp__mem0__remember"
        ],
        "document": [
            "mcp__filesystem__write_file",
            "mcp__mem0__remember"
        ],
        "ship": [
            "mcp__github__create_pr",
            "mcp__github__merge_pr",
            "mcp__n8n__execute_workflow"
        ]
    }
    return tools_by_phase.get(phase, [])


def create_mcp_config_file(project_root: Path):
    """Create MCP configuration file for the project."""
    config = {
        "version": "1.0.0",
        "gateway": {
            "postgres": {
                "kids_ascension": "iccc0wo0wkgsws4cowk4440c",
                "ozean_licht": "zo8g4ogg8g0gss0oswkcs84w"
            },
            "mem0": {
                "endpoint": "http://mem0.ozean-licht.dev:8090"
            },
            "n8n": {
                "endpoint": "http://n8n.ozean-licht.dev:5678"
            },
            "qdrant": {
                "endpoint": "http://qdrant.ozean-licht.dev:6333"
            }
        },
        "adw": {
            "port_backend_start": 9100,
            "port_frontend_start": 9200,
            "max_concurrent": 15
        }
    }

    config_path = project_root / ".mcp_gateway.json"
    with open(config_path, 'w') as f:
        json.dump(config, f, indent=2)

    print(f"Created MCP configuration at {config_path}")
    return config_path


# Example usage for testing
async def test_mcp_integration():
    """Test MCP integration."""
    adw = MCPEnabledADW(adw_id="test123", issue_number=1)

    # Test memory search
    memories = await adw.mcp_gateway.search_memory("test")
    print(f"Found {len(memories)} memories")

    # Test memory creation
    result = await adw.mcp_gateway.remember("Test memory from ADW")
    print(f"Memory stored: {result}")

    # Cleanup
    await adw.cleanup()


if __name__ == "__main__":
    # Run test
    asyncio.run(test_mcp_integration())