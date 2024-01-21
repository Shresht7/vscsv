// Library
import * as vscode from 'vscode';
import { VSCSV } from '../library';
import { shuffle } from '../utils';

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
            [
                { language: 'csv' },
                { language: 'tsv' },
            ],
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
        // Determine the delimiter to use
        this.parser.determineDelimiter(document);

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

