// Library
import * as vscode from 'vscode';
import { DocumentSemanticTokensProvider } from "./classes";
import { Configuration } from "../configuration";

// -------------------
// SYNTAX HIGHLIGHTING
// -------------------

export class SyntaxHighlighting {

    public static initialize(context: vscode.ExtensionContext) {

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

}
