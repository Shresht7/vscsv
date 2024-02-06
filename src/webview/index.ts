// Library
import * as vscode from 'vscode';
import { VSCSV } from '../library';
import { language } from '../library/helpers';
import { generateNonce } from './utils';
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

    // --------
    // INSTANCE
    // --------

    private constructor(
        public readonly panel: vscode.WebviewPanel,
        private readonly extensionUri: vscode.Uri
    ) {
        // Set the webview's initial html content
        this.update();

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

    /** Update the webview */
    private update() {
        this.panel.webview.html = this.getHtmlForWebview();
    }

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

        return `<!DOCTYPE html>
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
                        <label for="search">Search</label>
                        <vscode-text-field id="search" type="text" placeholder="Search..."></vscode-text-field>
                    </div>
                </footer>
            </body>
        </html>
        `;
    }

}

export class CustomTextEditor implements vscode.CustomTextEditorProvider {

    private static readonly viewType = 'vscsv.csvEditor';

    private static parser = new VSCSV();

    public static register(context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.window.registerCustomEditorProvider(
                CustomTextEditor.viewType,
                new CustomTextEditor(context),
            )
        );
    }

    constructor(private readonly context: vscode.ExtensionContext) { }

    // Called when our custom editor is opened
    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        token: vscode.CancellationToken
    ): Promise<void> {
        // Setup the initial content for the webview
        webviewPanel.webview.options = {
            enableScripts: true, // Enable JavaScript in the webview
            localResourceRoots: [vscode.Uri.joinPath(this.context.extensionUri, 'out')] // Restrict the webview to only loading content from our extension's `out` directory.
        };
        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview);

        // Hookup event handlers so that we can synchronize the webview with the text editor.
        // The text document acts as our model, so we have to sync changes in the document to our editor and vice-versa.
        // Note that a single text document can also be shared between multiple custom editors.
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                const data = this.parseDocument(document);
                if (data) {
                    webviewPanel.webview.postMessage({ command: 'update', data } as VSCodeMessage);
                }
            }
        });

        // Make sure we clean up after ourselves when the custom editor is closed
        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });

        // Receive message from the webview
        webviewPanel.webview.onDidReceiveMessage(this.handleMessage);

        const data = this.parseDocument(document);
        if (data) {
            webviewPanel.webview.postMessage({ command: 'update', data } as VSCodeMessage);
        }
    }

    private parseDocument(document: vscode.TextDocument) {
        if (!language.isSupported(document.languageId)) { return; } // Return early if the document is not a supported language
        const delimiter = language.delimiters[document.languageId];
        CustomTextEditor.parser.setDelimiter(delimiter);
        return CustomTextEditor.parser.parse(document.getText());
    }

    // MESSAGES
    // --------

    private handleMessage(message: WebviewMessage) {
        switch (message.command) {
            case 'error':
                vscode.window.showErrorMessage(message.data);
                return;
        }
    }


    // WEBVIEW
    // -------

    /** Get the uri for the webview resource */
    private getWebviewUri(webview: vscode.Webview, ...pathSegments: string[]): vscode.Uri {
        const path = vscode.Uri.joinPath(this.context.extensionUri, ...pathSegments);
        return webview.asWebviewUri(path);
    }

    /** Get the html content for the webview */
    private getHtmlForWebview(webview: vscode.Webview): string {

        // Local path to script and css for the webview
        const scriptUri = this.getWebviewUri(webview, 'out', 'webview.js');
        const styleUri = this.getWebviewUri(webview, 'out', 'style.css');

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
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

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
                        <label for="search">Search</label>
                        <vscode-text-field id="search" type="text" placeholder="Search..."></vscode-text-field>
                    </div>
                </footer>
            </body>
        </html>
        `;

    }

}
