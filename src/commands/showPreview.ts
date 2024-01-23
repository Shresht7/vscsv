// Library
import * as vscode from 'vscode';
import { Webview } from '../webview';
import { Parser } from '../library';
import { language } from '../library/helpers';

// --------------------
// SHOW PREVIEW COMMAND
// --------------------

/** Opens a preview window for the CSV file. */
export function showPreview(context: vscode.ExtensionContext) {

    const document = vscode.window.activeTextEditor?.document;
    if (!document) { return; } // Exit early if no document is open

    // Render the webview
    Webview.render(context.extensionUri);

    // Return early if the document is not a supported language
    if (!language.isSupported(document.languageId)) { return; }

    // Parse the data
    const delimiter = language.getDelimiter(document.languageId);
    const parser = new Parser({ delimiter });
    const { data } = parser.parse(document.getText());

    // Send the data to the webview
    Webview.postMessage({ command: 'update', data });

}
