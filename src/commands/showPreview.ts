// Library
import * as vscode from 'vscode';
import { Webview } from '../webview';

// --------------------
// SHOW PREVIEW COMMAND
// --------------------

/** Opens a preview window for the CSV file. */
export async function showPreview(context: vscode.ExtensionContext) {

    // Exit early if no document is open
    const document = vscode.window.activeTextEditor?.document;
    if (!document) { return; }

    // Render the webview and wait for it to load
    await Webview.render(context.extensionUri);

    // Parse the data and send it to the webview
    Webview.update(document);

}
