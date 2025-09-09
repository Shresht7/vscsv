// Library
import * as vscode from 'vscode';
import { Parser } from '../library';

// Helpers
import { language } from '../library/helpers';
import { generateNonce } from './utils';

// Type Definitions
import type { VSCodeMessage, WebviewMessage } from './types';

// -------
// WEBVIEW
// -------

export class Webview {

    // ------
    // STATIC
    // ------

    /** The title of the webview panel */
    private static readonly title = 'Table Preview';

    /** Identifies the type of the webview */
    public static readonly viewType = 'tablePreview';

    /** The column in which the webview should appear. (See {@linkcode vscode.ViewColumn}) */
    private static readonly viewColumn = vscode.ViewColumn.Beside;

    /** Tracks the current panel. Only one is allowed to exist at a time */
    public static currentPanel: Webview | undefined;

    // CREATE/  RENDER / REVIVE
    // ------------------------

    /** Create a new panel.
     * The panel is not shown until the {@linkcode render} method is called.
     * @param extensionUri The uri of the extension
     * @param viewColumn The column in which the webview should appear (default: `Beside`)
     * @returns A {@linkcode Webview} panel
     * @see {@link vscode.ViewColumn}
    */
    public static create(
        extensionUri: vscode.Uri,
        viewColumn: vscode.ViewColumn = this.viewColumn,
    ): Webview {
        const panel = vscode.window.createWebviewPanel(
            this.viewType,
            this.title,
            viewColumn,
            this.getOptions(extensionUri),
        );
        return new Webview(panel, extensionUri);
    }

    /** Show the webview panel.
     * The panel is created if it does not already exist.
     * @param extensionUri The uri of the extension
     * @param viewColumn The column in which the webview should appear (default: `Beside`)
     * @returns A promise that resolves when the webview sends a "ready" message (on page load)
     * @see {@linkcode vscode.ViewColumn}
    */
    public static render(
        extensionUri: vscode.Uri,
        viewColumn: vscode.ViewColumn = this.viewColumn
    ): Promise<void> {
        // If we already have a panel...
        if (Webview.currentPanel) {
            // ...reveal the panel
            Webview.currentPanel.panel.reveal(viewColumn);
        } else {
            // ...Otherwise, create a new panel
            this.currentPanel = this.create(extensionUri, viewColumn);
        }

        // Listen for when a supported text document is opened and update the webview with the new data
        vscode.window.onDidChangeActiveTextEditor((e) => {
            if (!e?.document) { return; } // Return early if no document is open
            if (!this.currentPanel?.panel.visible) { return; } // Return early if the panel is not visible
            this.update(e.document); // Update the webview with the new data from the document
        }, null, this.currentPanel?.disposables);

        // Return a promise that resolves when the webview sends a "ready" message (on page load)
        return new Promise((resolve, reject) => {
            this.currentPanel?.panel.webview.onDidReceiveMessage((message: WebviewMessage) => {
                if (message.command === 'ready') { resolve(); } else { reject(); } // ? Might be a good place to request for data
            }, null, this.currentPanel?.disposables);
        });
    }

    /** Revive the webview panel
     * @param panel The webview panel to revive
     * @param extensionUri The uri of the extension
     * @see {@linkcode Webview}
    */
    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this.currentPanel = new Webview(panel, extensionUri);
    }

    // OPTIONS
    // -------

    /** Get the webview options for the webview. See ({@linkcode vscode.WebviewOptions}) */
    private static getOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
        return {
            // Enable JavaScript in the webview
            enableScripts: true,
            // Restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'out')]
        };
    }

    // MESSAGE
    // -------

    /** Send a message to the webview */
    public static postMessage(message: VSCodeMessage) {
        this.currentPanel?.panel.webview.postMessage(message);
    }

    // DOCUMENT
    // --------

    /**
     * Updates the webview with the parsed data from the given text document.
     * @param document The text document to parse and update the webview with.
     */
    public static update(document: vscode.TextDocument) {
        // Return early if the document is not a supported language
        if (!language.isSupported(document.languageId)) { return; }

        // Parse the data
        const delimiter = language.delimiters[document.languageId];
        const parser = new Parser({ delimiter });
        const data = parser.parse(document.getText());

        // Send the data to the webview
        this.postMessage({ command: 'update', data });
    }

    // --------
    // INSTANCE
    // --------

    private constructor(
        public readonly panel: vscode.WebviewPanel,
        private readonly extensionUri: vscode.Uri
    ) {
        // Set the webview's initial html content
        this.panel.webview.html = this.getHtmlForWebview();

        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

        // Handle messages from the webview
        this.panel.webview.onDidReceiveMessage(this.handleMessage, null, this.disposables);
    }

    // DISPOSE
    // -------

    /** A collection of disposables to dispose when the panel is disposed */
    private disposables: vscode.Disposable[] = [];

    /** Dispose off the current panel and related disposables */
    public dispose() {
        Webview.currentPanel = undefined; // Set current panel to undefined
        this.panel.dispose();   // Dispose off the panel
        while (this.disposables.length) {
            const disposable = this.disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    // MESSAGE
    // -------

    /** Handle messages from the webview */
    private handleMessage(message: WebviewMessage) {
        switch (message.command) {
            case 'error':
                // In case of an error, show a vscode error message
                vscode.window.showErrorMessage(message.data);
                return;
        }
    }

    // CONTENT
    // -------

    /** Get the uri for the webview resource */
    private getWebviewUri(...pathSegments: string[]): vscode.Uri {
        const path = vscode.Uri.joinPath(this.extensionUri, ...pathSegments);
        return this.panel.webview.asWebviewUri(path);
    }

    /** Get the html content for the webview */
    private getHtmlForWebview(): string {

        // Local path to script and css for the webview
        const scriptUri = this.getWebviewUri('out', 'webview.js');
        const styleUri = this.getWebviewUri('out', 'style.css');

        // Use a nonce to allow only specific scripts to run
        const nonce = generateNonce();

        return /* html */ `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <!--
                    Use a content security policy to only allow loading images from https or from our extension directory,
                    and only allow scripts that have a specific nonce.
                -->
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${this.panel.webview.cspSource}; script-src 'nonce-${nonce}';">

                <link href="${styleUri}" rel="stylesheet" />

                <script type="module" nonce="${nonce}" src="${scriptUri}"></script>

                <title>Webview</title>
            </head>

            <body>
                <main>
                    <table id="table"></table>
                </main>
                <footer>
                    <vscode-divider role="presentation"></vscode-divider>
                    <div id="search-input-container">
                        <label for="search">Filter</label>
                        <vscode-text-field id="search" type="text" placeholder="Query..."></vscode-text-field>
                    </div>
                </footer>
            </body>
        </html>
        `;
    }

}

