// Library
import * as vscode from 'vscode';

// ---------------
// WEBVIEW OPTIONS
// ---------------

export function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
    return {
        // Enable JavaScript in the webview
        enableScripts: true,
        // Restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'out')]
    };
}
