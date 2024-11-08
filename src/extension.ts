import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
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

        // Show quickpick (dropdown) with script names
        const selectedScript = await vscode.window.showQuickPick(scriptNames, {
          placeHolder: "Select a script to run",
        });

        if (selectedScript) {
          // Create terminal if it doesn't exist
          let terminal = vscode.window.terminals.find(
            (t) => t.name === "NPM Scripts"
          );
          if (!terminal) {
            terminal = vscode.window.createTerminal("NPM Scripts");
          }

          // Run the selected script
          terminal.show();
          terminal.sendText(`npm run ${selectedScript}`);
        }
      } catch (error) {
        if (error instanceof Error) {
          vscode.window.showErrorMessage(`Error: ${error.message}`);
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
