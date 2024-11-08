import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { CommandStats } from "./utils/commandStats";
import { detectPackageManager, getRunCommand } from "./utils/packageManager";

export function activate(context: vscode.ExtensionContext) {
  console.log("Activating SelectScript...");

  // Create output channel with more visibility
  const outputChannel = vscode.window.createOutputChannel("SelectScript");
  outputChannel.appendLine("SelectScript activation started");
  outputChannel.show(true);

  // Log workspace information
  const workspaceFolders = vscode.workspace.workspaceFolders;
  outputChannel.appendLine(
    `Workspace folders: ${workspaceFolders ? workspaceFolders.length : "none"}`
  );

  const commandStats = new CommandStats(context);

  // Register the command that will show the dropdown
  let disposable = vscode.commands.registerCommand(
    "extension.runNpmScript",
    async () => {
      try {
        // Get the workspace folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
          throw new Error("No workspace folder found");
        }

        // Detect package manager
        const workspacePath = workspaceFolders[0].uri.fsPath;
        const packageManager = detectPackageManager(workspacePath);
        const runCommand = getRunCommand(packageManager);

        // Read package.json
        const packageJsonPath = path.join(
          workspaceFolders[0].uri.fsPath,
          "package.json"
        );
        if (!fs.existsSync(packageJsonPath)) {
          throw new Error("No package.json found in workspace root");
        }

        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf8")
        );
        const scripts = packageJson.scripts || {};
        const scriptNames = Object.keys(scripts);

        if (scriptNames.length === 0) {
          vscode.window.showInformationMessage(
            "No scripts found in package.json"
          );
          return;
        }

        // Create and configure QuickPick with organized items
        const quickPick = vscode.window.createQuickPick();
        quickPick.items = commandStats.organizeScripts(scriptNames, scripts);
        quickPick.placeholder = "Select a script to run";
        quickPick.matchOnDetail = true;
        quickPick.title = "Run Script";

        // Handle selection
        quickPick.onDidAccept(async () => {
          const selected = quickPick.selectedItems[0];
          // Don't execute if a separator is selected
          if (selected?.kind === vscode.QuickPickItemKind.Separator) {
            return;
          }

          if (selected?.label) {
            // Record usage
            await commandStats.recordUsage(selected.label);

            // Create terminal if it doesn't exist
            let terminal = vscode.window.terminals.find(
              (t) => t.name === "Script Runner"
            );
            if (!terminal) {
              terminal = vscode.window.createTerminal("Script Runner");
            }

            // Run the selected script with the correct package manager
            terminal.show();
            terminal.sendText(`${runCommand} ${selected.label}`);
          }

          quickPick.dispose();
        });

        quickPick.onDidHide(() => {
          quickPick.dispose();
        });

        quickPick.show();
      } catch (error) {
        if (error instanceof Error) {
          vscode.window.showErrorMessage(`Error: ${error.message}`);
        }
      }
    }
  );

  // Register the command palette command
  const commandPaletteDisposable = vscode.commands.registerCommand(
    "extension.runNpmScriptFromCommandPalette",
    async () => {
      await vscode.commands.executeCommand("extension.runNpmScript");
    }
  );

  // Register the status bar button
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    10000
  );
  statusBarItem.command = "extension.runNpmScript";
  statusBarItem.text = "$(play)";
  statusBarItem.tooltip = "Click to run a script";
  // statusBarItem.backgroundColor = new vscode.ThemeColor(
  //   "statusBarItem.warningBackground"
  // );
  statusBarItem.show();

  context.subscriptions.push(
    disposable,
    commandPaletteDisposable,
    statusBarItem
  );
}

export function deactivate() {}
