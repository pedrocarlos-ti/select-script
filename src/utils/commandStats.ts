import * as vscode from "vscode";

interface CommandUsage {
  command: string;
  count: number;
  lastUsed: number;
}

export interface ScriptQuickPickItem extends vscode.QuickPickItem {
  label: string;
  kind?: vscode.QuickPickItemKind;
}

export class CommandStats {
  private static readonly STORAGE_KEY = "selectscript.commandStats";
  private context: vscode.ExtensionContext;
  private stats: CommandUsage[];

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.stats = this.loadStats();
  }

  private loadStats(): CommandUsage[] {
    return this.context.globalState.get<CommandUsage[]>(
      CommandStats.STORAGE_KEY,
      []
    );
  }

  private async saveStats(): Promise<void> {
    await this.context.globalState.update(CommandStats.STORAGE_KEY, this.stats);
  }

  async recordUsage(command: string): Promise<void> {
    const existing = this.stats.find((s) => s.command === command);

    if (existing) {
      existing.count++;
      existing.lastUsed = Date.now();
    } else {
      this.stats.push({
        command,
        count: 1,
        lastUsed: Date.now(),
      });
    }

    await this.saveStats();
  }

  getTopCommands(limit: number = 3): CommandUsage[] {
    return [...this.stats].sort((a, b) => b.count - a.count).slice(0, limit);
  }

  organizeScripts(
    scriptNames: string[],
    scripts: Record<string, string>
  ): ScriptQuickPickItem[] {
    const items: ScriptQuickPickItem[] = [];
    const topCommands = this.getTopCommands(3);
    const topCommandNames = new Set(topCommands.map((c) => c.command));

    // Get all scripts with their usage stats
    const allScripts = scriptNames
      .map((name) => {
        const usageStats = this.stats.find((s) => s.command === name);
        return {
          name,
          count: usageStats?.count || 0,
          usageStats,
        };
      })
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    // Add all scripts first
    allScripts.forEach(({ name, usageStats }) => {
      items.push({
        label: name,
        detail: scripts[name],
        description: usageStats
          ? `Used ${usageStats.count} ${
              usageStats.count === 1 ? "time" : "times"
            }`
          : undefined,
        buttons: [
          {
            iconPath: new vscode.ThemeIcon("play"),
            tooltip: "Run Script",
          },
        ],
      });

      // Insert the "Frequently Used" separator after the third item
      if (items.length === 3 && topCommands.length > 0) {
        // Add "Other Scripts" separator
        items.push({
          kind: vscode.QuickPickItemKind.Separator,
          label: "Other Scripts",
        });
      }
    });

    return items;
  }
}
