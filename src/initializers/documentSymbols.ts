// Library
import * as vscode from 'vscode';
import { DocumentSymbolProvider } from '../providers';
import { Configuration } from '../configuration';

// ----------------
// DOCUMENT SYMBOLS
// ----------------

export function initialize(context: vscode.ExtensionContext) {

    if (Configuration.get('enableDocumentSymbols')) {
        DocumentSymbolProvider.initialize(context);
    }

    Configuration.registerListener('enableDocumentSymbols', (value) => {
        if (value) {
            DocumentSymbolProvider.initialize(context);
        } else {
            DocumentSymbolProvider.dispose();
        }
    });

}
