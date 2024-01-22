// Library
import * as vscode from 'vscode';
import { generateNonce } from '../utils';

// -------
// WEBVIEW
// -------

export class Webview {

    public static readonly viewType = 'tablePreview';

    /** Tracks the current panel. Only one is allowed to exist at a time */
    public static currentPanel: Webview | undefined;

    private disposables: vscode.Disposable[] = [];

    private constructor(
        private readonly panel: vscode.WebviewPanel,
        private readonly extensionUri: vscode.Uri
    ) {
        // Set the webview's initial html content
        this.update();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

        // Update the content based on the view changes
        this.panel.onDidChangeViewState(e => {
            if (this.panel.visible) {
                this.update();
            }
        }, null, this.disposables);
    }

    private dispose() {
        Webview.currentPanel = undefined; // Unset current panel
        this.panel.dispose();   // Dispose off the panel
        while (this.disposables.length) {
            const disposable = this.disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private static createPanel(
        title: string,
        viewColumn: vscode.ViewColumn | undefined,
        options: vscode.WebviewOptions,
    ) {
        return vscode.window.createWebviewPanel(
            this.viewType,
            'Webview',
            viewColumn || vscode.ViewColumn.One,
            options,
        );
    }

    public static show(extensionUri: vscode.Uri) {
        const viewColumn = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it.
        if (Webview.currentPanel) {
            Webview.currentPanel.panel.reveal(viewColumn);
            return;
        }

        // Otherwise, create a new panel.
        const panel = this.createPanel(
            'Webview',
            viewColumn,
            this.getWebviewOptions(extensionUri),
        );

        Webview.currentPanel = new Webview(panel, extensionUri);
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        Webview.currentPanel = new Webview(panel, extensionUri);
    }

    private update() {
        this.panel.title = "WEBVIEW";
        this.panel.webview.html = this.getHtmlForWebview();
    }

    private getWebviewUri(...pathSegments: string[]): vscode.Uri {
        const path = vscode.Uri.joinPath(this.extensionUri, ...pathSegments);
        return this.panel.webview.asWebviewUri(path);
    }

    private getHtmlForWebview(): string {

        // Local path to script and css for the webview
        const scriptUri = this.getWebviewUri('media', 'main.js');
        const styleUri = this.getWebviewUri('media', 'vscode.css');
        const cssResetUri = this.getWebviewUri('media', 'reset.css');

        // Use a nonce to allow only specific scripts to run
        const nonce = generateNonce();

        return `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <!--
                    Use a content security policy to only allow loading images from https or from our extension directory,
                    and only allow scripts that have a specific nonce.
                -->
                <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
                
                <link href="${cssResetUri}" rel="stylesheet">
				<link href="${styleUri}" rel="stylesheet">

                <title>Webview</title>
            </head>

            <body>
                <h1>Hello World!</h1>
            </body>
        </html>
        `;
    }

    public static getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
        return {
            // Enable JavaScript in the webview
            enableScripts: true,
            // Restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
        };
    }

}
