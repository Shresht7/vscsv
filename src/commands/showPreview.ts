// Library
import * as vscode from 'vscode';
import { Webview } from '../views';
import { CSV } from '../library';

// --------------------
// SHOW PREVIEW COMMAND
// --------------------

/** This method is called when the "Show Preview" command is executed */
export function showPreview(context: vscode.ExtensionContext) {
    Webview.render(context.extensionUri);
    const doc = vscode.window.activeTextEditor?.document;
    if (doc?.languageId === 'csv') {
        const csv = CSV.parse(doc.getText());
        Webview.postMessage({
            command: 'update',
            data: csv,
        });
    }
}
