// Library
import * as vscode from 'vscode';
import { Webview } from '../views';
import { Parser } from '../library';

// --------------------
// SHOW PREVIEW COMMAND
// --------------------

/** Opens a preview window for the CSV file. */
export function showPreview(context: vscode.ExtensionContext) {

    const document = vscode.window.activeTextEditor?.document;
    if (!document) { return; } // Exit early if no document is open

    // Render the webview
    Webview.render(context.extensionUri);

    // Return early if the document is not a CSV or TSV file
    if (!['csv', 'tsv'].includes(document.languageId)) { return; }

    // Parse the data
    const delimiter = determineDelimiter(document);
    const parser = new Parser({ delimiter });
    const { data } = parser.parse(document.getText());

    // Send the data to the webview
    Webview.postMessage({
        command: 'update',
        data,
    });

}

/**
 * Determines the delimiter for the document
 * @param document The document to determine the delimiter for
 * @returns The delimiter for the document
 */
function determineDelimiter(document: vscode.TextDocument) {
    switch (document.languageId) {
        case 'csv':
            return ',';
        case 'tsv':
            return '\t';
        default:
            return '';
    }
}
