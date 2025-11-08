#!/usr/bin/env python3
"""
Token Usage Monitor

Real-time monitoring script to track token usage and verify
that aggressive context windowing is preventing rate limiting.

Usage:
    python monitor_tokens.py [--port 9403]
"""

import asyncio
import aiohttp
import argparse
from datetime import datetime
import sys
from rich.console import Console
from rich.table import Table
from rich.live import Live
from rich.panel import Panel
from rich.layout import Layout


console = Console()


async def fetch_metrics(base_url: str):
    """Fetch token metrics from the API."""
    try:
        async with aiohttp.ClientSession() as session:
            # Fetch token metrics
            async with session.get(f"{base_url}/api/metrics/tokens") as resp:
                if resp.status == 200:
                    return await resp.json()
                else:
                    return {"error": f"Status {resp.status}"}
    except Exception as e:
        return {"error": str(e)}


def create_dashboard(metrics: dict) -> Panel:
    """Create a rich dashboard display."""

    # Create layout
    layout = Layout()

    # Main table
    table = Table(title="🔍 Token Usage Monitor", show_header=True, header_style="bold magenta")
    table.add_column("Metric", style="cyan", width=30)
    table.add_column("Value", style="green", width=40)
    table.add_column("Status", style="yellow", width=20)

    if "error" in metrics:
        table.add_row("Status", f"Error: {metrics['error']}", "❌")
        return Panel(table, title=f"Token Monitor - {datetime.now().strftime('%H:%M:%S')}")

    # Check if enabled
    enabled = metrics.get("enabled", False)
    table.add_row("Token Management", "ENABLED" if enabled else "DISABLED", "✅" if enabled else "❌")

    if not enabled:
        return Panel(table, title=f"Token Monitor - {datetime.now().strftime('%H:%M:%S')}")

    # Context settings
    if "context" in metrics:
        ctx = metrics["context"]
        table.add_row(
            "Context Limits",
            f"{ctx['max_messages']} msgs / {ctx['max_tokens']:,} tokens",
            "🎯 AGGRESSIVE" if ctx['max_tokens'] <= 25000 else "⚠️ STANDARD"
        )

    # Rate limiter stats
    if "rate_limiter" in metrics:
        rl = metrics["rate_limiter"]
        usage_pct = rl.get("usage_percentage", 0)

        # Determine status emoji based on usage
        if usage_pct < 50:
            status = "✅ SAFE"
            style = "green"
        elif usage_pct < 80:
            status = "⚠️ MODERATE"
            style = "yellow"
        else:
            status = "🚨 HIGH RISK"
            style = "red"

        table.add_row(
            "Current Token Usage",
            f"{rl['current_usage']:,} / {rl['tokens_per_minute']:,}",
            status
        )

        table.add_row(
            "Usage Percentage",
            f"{usage_pct:.1f}%",
            status
        )

        reset_time = rl.get("time_until_reset", 0)
        table.add_row(
            "Window Reset In",
            f"{reset_time:.1f} seconds",
            "⏰"
        )

    # Cache stats
    if "cache" in metrics:
        cache = metrics["cache"]
        hit_rate = cache.get("hit_rate", 0) * 100

        table.add_row(
            "Cache Performance",
            f"{hit_rate:.1f}% hit rate ({cache.get('entries', 0)} entries)",
            "✅" if hit_rate > 30 else "📈 WARMING"
        )

    # Cost tracking
    if "costs" in metrics:
        costs = metrics["costs"]
        total_cost = costs.get("total_cost_usd", 0)
        threshold = costs.get("threshold_usd", 10)
        exceeded = costs.get("threshold_exceeded", False)

        table.add_row(
            "Total Cost",
            f"${total_cost:.4f} / ${threshold:.2f}",
            "🚨 EXCEEDED" if exceeded else "💰 OK"
        )

        table.add_row(
            "Total Tokens",
            f"In: {costs.get('total_input_tokens', 0):,} | Out: {costs.get('total_output_tokens', 0):,}",
            "📊"
        )

    # Add timestamp
    table.add_row(
        "",
        "",
        ""
    )
    table.add_row(
        "Last Updated",
        datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "🕐"
    )

    # Create panel with border
    panel = Panel(
        table,
        title="🚀 Orchestrator Token Monitor",
        subtitle="Press Ctrl+C to exit",
        border_style="blue"
    )

    return panel


async def monitor_loop(base_url: str, interval: int = 5):
    """Main monitoring loop."""

    console.print("[bold cyan]Starting Token Usage Monitor...[/bold cyan]")
    console.print(f"[dim]Monitoring endpoint: {base_url}/api/metrics/tokens[/dim]")
    console.print(f"[dim]Update interval: {interval} seconds[/dim]\n")

    with Live(console=console, refresh_per_second=1) as live:
        while True:
            try:
                # Fetch metrics
                metrics = await fetch_metrics(base_url)

                # Create and update dashboard
                dashboard = create_dashboard(metrics)
                live.update(dashboard)

                # Check for critical conditions
                if "rate_limiter" in metrics:
                    usage_pct = metrics["rate_limiter"].get("usage_percentage", 0)
                    if usage_pct > 90:
                        console.print("\n[bold red]⚠️ CRITICAL: Token usage above 90%! Rate limiting imminent![/bold red]")

                # Wait for next update
                await asyncio.sleep(interval)

            except KeyboardInterrupt:
                break
            except Exception as e:
                console.print(f"[red]Error: {e}[/red]")
                await asyncio.sleep(interval)

    console.print("\n[bold green]Monitor stopped.[/bold green]")


async def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description="Monitor token usage in real-time")
    parser.add_argument(
        "--port",
        type=int,
        default=9403,
        help="Backend server port (default: 9403)"
    )
    parser.add_argument(
        "--interval",
        type=int,
        default=5,
        help="Update interval in seconds (default: 5)"
    )

    args = parser.parse_args()

    base_url = f"http://localhost:{args.port}"

    # Test connection first
    console.print(f"[yellow]Testing connection to {base_url}...[/yellow]")
    test_metrics = await fetch_metrics(base_url)

    if "error" in test_metrics:
        console.print(f"[bold red]Failed to connect: {test_metrics['error']}[/bold red]")
        console.print("[dim]Make sure the orchestrator backend is running.[/dim]")
        sys.exit(1)

    console.print("[bold green]Connection successful![/bold green]\n")

    # Start monitoring
    await monitor_loop(base_url, args.interval)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        console.print("\n[yellow]Monitor stopped by user.[/yellow]")