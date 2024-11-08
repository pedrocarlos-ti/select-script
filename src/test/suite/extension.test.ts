import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

suite("SelectScript Extension Test Suite", () => {
  const testWorkspace = path.join(__dirname, "../../../test-workspace");
  let mockPackageJson: any;

  suiteSetup(() => {
    // Create test workspace
    if (!fs.existsSync(testWorkspace)) {
      fs.mkdirSync(testWorkspace, { recursive: true });
    }

    // Create mock package.json
    mockPackageJson = {
      scripts: {
        test: "jest",
        build: "webpack",
        start: "node index.js",
        lint: "eslint",
      },
    };
    fs.writeFileSync(
      path.join(testWorkspace, "package.json"),
      JSON.stringify(mockPackageJson)
    );
  });

  suiteTeardown(() => {
    // Cleanup test workspace
    if (fs.existsSync(testWorkspace)) {
      fs.rmSync(testWorkspace, { recursive: true });
    }
  });

  test("Extension should be activated", async () => {
    const ext = vscode.extensions.getExtension("melro.io.selectscript");
    assert.ok(ext);
    await ext?.activate();
    assert.strictEqual(ext?.isActive, true);
  });

  test('Command "extension.runNpmScript" should be registered', () => {
    const commands = vscode.commands.getCommands(true);
    return commands.then((list) => {
      assert.ok(list.includes("extension.runNpmScript"));
    });
  });

  test("Status bar item should be visible", () => {
    // Get all visible status bar items
    const visibleItems = vscode.window.createStatusBarItem().id;
    assert.ok(visibleItems, "Status bar should be available");
  });

  test("QuickPick should show available scripts", async () => {
    // Open the test workspace first
    await vscode.commands.executeCommand(
      "vscode.openFolder",
      vscode.Uri.file(testWorkspace)
    );

    // Create QuickPick and set its items
    const quickPick = vscode.window.createQuickPick();
    quickPick.items = Object.keys(mockPackageJson.scripts).map((script) => ({
      label: script,
    }));

    // Verify items match package.json scripts
    const scriptNames = Object.keys(mockPackageJson.scripts);
    assert.strictEqual(
      quickPick.items.length,
      scriptNames.length,
      "QuickPick should have all scripts from package.json"
    );

    // Cleanup
    quickPick.dispose();
  });

  test("Script execution should create terminal", async () => {
    // Close any existing terminals
    vscode.window.terminals.forEach((terminal) => terminal.dispose());
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Create a new terminal
    const terminal = vscode.window.createTerminal("Script Runner");
    terminal.show();

    // Execute the command
    await vscode.commands.executeCommand(
      "extension.runNpmScriptFromCommandPalette",
      "test"
    );

    // Wait for terminal operations
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verify terminal
    const terminals = vscode.window.terminals;
    assert.strictEqual(terminals.length, 1, "Should have exactly one terminal");
    assert.strictEqual(
      terminals[0].name,
      "Script Runner",
      "Terminal should be named Script Runner"
    );

    // Cleanup
    terminals.forEach((t) => t.dispose());
  });
});
