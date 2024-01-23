// Library
import * as vscode from 'vscode';
import { DocumentSymbolProvider } from './classes';
import { Configuration } from '../configuration';

// -------
// SYMBOLS
// -------

export class Symbols {

    public static initialize(context: vscode.ExtensionContext) {

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

}
