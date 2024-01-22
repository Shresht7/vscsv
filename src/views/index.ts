// Library
import * as vscode from 'vscode';

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

        if (vscode.window.registerWebviewPanelSerializer) {
            // Make sure we register a serializer in activation event
            vscode.window.registerWebviewPanelSerializer(Webview.viewType, {
                async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
                    console.log(`Got state: ${state}`);
                    // Reset the webview options so we use latest uri for `localResourceRoots`.
                    webviewPanel.webview.options = Webview.getWebviewOptions(extensionUri);
                    Webview.revive(webviewPanel, extensionUri);
                }
            });
        }
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

    public static createOrShow(extensionUri: vscode.Uri) {
        const viewColumn = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        // If we already have a panel, show it.
        if (Webview.currentPanel) {
            Webview.currentPanel.panel.reveal(viewColumn);
            return;
        }

        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(
            Webview.viewType,
            'Cat Coding',
            viewColumn || vscode.ViewColumn.One,
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

    private getHtmlForWebview(): string {
        return 'Hello World!';
    }

    private static getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
        return {
            // Enable JavaScript in the webview
            enableScripts: true,
            // Restrict the webview to only loading content from our extension's `media` directory.
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
        };
    }

}
