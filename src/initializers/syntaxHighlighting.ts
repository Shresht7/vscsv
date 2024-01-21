// Library
import * as vscode from 'vscode';
import { DocumentSemanticTokensProvider } from "../providers";
import { Configuration } from "../configuration";

// -------------------
// SYNTAX HIGHLIGHTING
// -------------------

export function initialize(context: vscode.ExtensionContext) {

    if (Configuration.get('enableSyntaxHighlighting')) {
        DocumentSemanticTokensProvider.initialize(context);
    }

    Configuration.registerListener('enableSyntaxHighlighting', (value) => {
        if (value) {
            DocumentSemanticTokensProvider.initialize(context);
        } else {
            DocumentSemanticTokensProvider.dispose();
        }
    });

}
