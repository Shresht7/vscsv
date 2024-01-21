// Library
import * as vscode from 'vscode';
import { DocumentSemanticTokensProvider } from "../providers";
import { Configuration } from "../configuration";

// -------------------
// SYNTAX HIGHLIGHTING
// -------------------

/** Initialize the semantic tokens provider */
export function initialize(context: vscode.ExtensionContext) {

    // Register the semantic tokens provider to provide syntax highlighting
    if (Configuration.get('enableSyntaxHighlighting')) {
        DocumentSemanticTokensProvider.initialize(context);
    }

    // Register the configuration listener for the `enableSyntaxHighlighting` setting
    Configuration.registerListener('enableSyntaxHighlighting', (value) => {
        if (value) {
            DocumentSemanticTokensProvider.initialize(context);
        } else {
            DocumentSemanticTokensProvider.dispose();
        }
    });

}
