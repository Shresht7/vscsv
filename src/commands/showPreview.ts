// Library
import * as vscode from 'vscode';
import { Webview } from '../views';
import { CSV } from '../library';

// --------------------
// SHOW PREVIEW COMMAND
// --------------------

/** Opens a preview window for the CSV file. */
export function showPreview(context: vscode.ExtensionContext) {

    // Render the webview
    Webview.render(context.extensionUri);

    // Send the CSV data to the webview
    const doc = vscode.window.activeTextEditor?.document;
    if (doc?.languageId === 'csv' || doc?.languageId === 'tsv') {
        const csv = CSV.parse(doc.getText());
        Webview.postMessage({
            command: 'update',
            data: csv,
        });
    }

}
