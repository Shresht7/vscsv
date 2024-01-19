// Library
import * as vscode from 'vscode';
import { VSCSV } from './library';

// ---------
// HIGHLIGHT
// ---------

/** A semantic tokens provider for the CSV language to provide syntax highlighting. */
export class DocumentSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {

    // STATIC
    // ------

    /** The disposable used to unregister this provider */
    private static disposable: vscode.Disposable;

    /** The semantic tokens legend used to map token types to colors and styles */
    private static legend = new vscode.SemanticTokensLegend(shuffle([
        'nonexistent', // A nonexistent token to style as regular text
        'string', 'number', 'regexp', 'operator', 'keyword', 'namespace', 'comment',
        'type', 'struct', 'class', 'interface', 'enum', 'typeParameter', 'function',
        'method', 'decorator', 'macro', 'variable', 'parameter', 'property', 'label'
    ]));

    /**
    * Initialize the semantic tokens provider for the CSV language to provide syntax highlighting.
    * @param context The vscode extension context (see {@linkcode vscode.ExtensionContext})
    */
    public static initialize(context: vscode.ExtensionContext) {
        this.dispose(); // Dispose of any existing provider
        // Register the semantic tokens provider for the CSV language to provide syntax highlighting
        this.disposable = vscode.languages.registerDocumentSemanticTokensProvider(
            { language: 'csv' },
            new DocumentSemanticTokensProvider(),
            this.legend
        );
        // Register the disposable to dispose of the provider when the extension is deactivated
        context.subscriptions.push(this.disposable);
    }

    /** Dispose of the semantic tokens provider */
    public static dispose() {
        this.disposable?.dispose();
    }

    // INSTANCE
    // --------

    /** The parser used to parse the CSV document */
    private parser = new VSCSV();

    async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens> {
        // Parse the CSV document
        const csv = this.parser.parse(document.getText());
        // Build the semantic tokens
        const builder = new vscode.SemanticTokensBuilder();
        csv.forEachCell((cell, rowNumber, columnNumber) => {
            // Get the token index from the column number (use % to wrap around the token types)
            const tokenIndex = columnNumber % DocumentSemanticTokensProvider.legend.tokenTypes.length;
            builder.push(
                cell.line,
                cell.column,
                cell.value.length,
                tokenIndex
            );
        });
        // Return the semantic tokens
        return builder.build();
    }
}

/**
 * Shuffle an array in place using the Fisher-Yates algorithm
 * @param array The array to shuffle
 * @returns The shuffled array
 */
function shuffle<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap array[i] with array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
