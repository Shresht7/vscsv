// Library
import * as vscode from 'vscode';
import { Webview } from '../views';
import { getWebviewOptions } from '../views/utils';

// -------
// WEBVIEW
// -------

export function initialize(context: vscode.ExtensionContext) {

    // Make sure we register a serializer in activation event
    vscode.window.registerWebviewPanelSerializer(Webview.viewType, {
        async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
            console.log(`Got state: ${state}`);
            // Reset the webview options so we use latest uri for `localResourceRoots`.
            webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
            Webview.revive(webviewPanel, context.extensionUri);
        }
    });

}

