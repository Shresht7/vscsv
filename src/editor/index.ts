// Library
import * as vscode from 'vscode';
import { VSCSV } from '../library';
import { language } from '../library/helpers';
import { generateNonce } from './utils';
import type { VSCodeMessage, WebviewMessage } from './types';

// ------------------
// CUSTOM TEXT EDITOR
// ------------------

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