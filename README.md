# Select Script

Effortlessly run your scripts directly from VS Code, regardless of your package manager. SelectScript provides a clean, efficient dropdown interface to execute scripts from package.json without leaving your editor.

![Intro GIF](https://raw.githubusercontent.com/pedrocarlos-ti/select-script/refs/heads/main/intro.gif)

## Features

✨ Smart package manager detection (npm, yarn, pnpm)

🎯 Dedicated terminal for script execution

🔥 Keyboard shortcut: Ctrl+Shift+1 (Cmd+Shift+1 on Mac)

⚡ Native VS Code selection experience

📊 Frequently used scripts tracking

🔍 Automatic package.json detection

## Usage

### Quick Access Button

1. Click the play icon (▶️) in the VS Code status bar
2. Choose a script from the dropdown menu (frequently used scripts appear first)
3. Watch the script execute in a dedicated terminal

### Keyboard Shortcut

1. Press Ctrl+Shift+1 (Cmd+Shift+1 on Mac) to open the script selection menu
2. Select the script you want to run
3. The script will execute in a dedicated terminal

## Smart Package Manager Detection

SelectScript automatically detects your project's package manager:

- `yarn` - If yarn.lock is present
- `pnpm` - If pnpm-lock.yaml is present
- `npm` - Default, or if package-lock.json is present

Commands are automatically adjusted based on your package manager:

- npm: `npm run script-name`
- yarn: `yarn script-name`
- pnpm: `pnpm script-name`

## Why SelectScript?

Stop searching through package.json or remembering complex script names. SelectScript brings a convenient, easily accessible interface to your scripts, making development workflows faster and more efficient.

Perfect for:

- Frontend developers managing multiple build scripts
- Teams using different package managers
- Projects with numerous custom scripts
- Anyone who wants quick access to their project scripts

## Features in Detail

- **Smart Script Organization**: Frequently used scripts appear at the top for quick access
- **Script Details**: View the full command when selecting a script
- **Usage Statistics**: Track how often you use each script
- **Dedicated Terminal**: Scripts run in a dedicated "Script Runner" terminal
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Installation

1. Open the Extensions view in VS Code (Ctrl+Shift+X)
2. Search for "SelectScript" and click "Install"
3. Reload VS Code when prompted

## Feedback and Support

We appreciate your feedback! If you have any questions, issues, or feature requests, please don't hesitate to reach out:

- [Submit an issue on GitHub](https://github.com/pedrocarlos-ti/select-script/issues/new)
- [Contact the extension maintainers](mailto:pedrocarlos.ti@gmail.com)

Thank you for using SelectScript!
