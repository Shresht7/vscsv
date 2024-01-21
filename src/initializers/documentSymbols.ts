// Library
import * as vscode from 'vscode';
import { DocumentSymbolProvider } from '../providers';
import { Configuration } from '../configuration';

// ----------------
// DOCUMENT SYMBOLS
// ----------------

/** Initialize the document symbol provider */
export function initialize(context: vscode.ExtensionContext) {

    // Register the document symbol provider to provide symbol information
    if (Configuration.get('enableDocumentSymbols')) {
        DocumentSymbolProvider.initialize(context);
    }

    // Register the configuration listener for the `enableDocumentSymbols` setting
    Configuration.registerListener('enableDocumentSymbols', (value) => {
        if (value) {
            DocumentSymbolProvider.initialize(context);
        } else {
            DocumentSymbolProvider.dispose();
        }
    });

}
