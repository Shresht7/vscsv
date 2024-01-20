// Library
import * as vscode from 'vscode';
import { VSCSV } from './library';

// -------
// SYMBOLS
// -------

/**
 * This class provides document symbol information for the CSV language.
 * It is used to provide the outline view in the explorer panel and the breadcrumbs.
 * It also allows the user to make use of the "Go to Symbol" feature.
 * @see {@link vscode.DocumentSymbolProvider} for more information.
 */
export class DocumentSymbolProvider implements vscode.DocumentSymbolProvider {

    // STATIC
    // ------

    /** The document selector for the CSV language */
    private static selector: vscode.DocumentSelector = { language: 'csv' };

    /** The disposable used to unregister this provider, when needed */
    private static disposable: vscode.Disposable;

    /**
     * Initialize the document symbol provider for the CSV language to provide symbol information.
     * @param context The vscode extension context (see {@linkcode vscode.ExtensionContext})
     * @see {@link vscode.languages.registerDocumentSymbolProvider}
     * @see {@link vscode.DocumentSymbolProvider}
     */
    public static initialize(context: vscode.ExtensionContext) {
        this.disposable?.dispose(); // Dispose of any existing provider
        // Register the document symbol provider for the CSV language to provide symbol information
        this.disposable = vscode.languages.registerDocumentSymbolProvider(this.selector, new DocumentSymbolProvider());
        // Register the disposable to dispose of the provider when the extension is deactivated
        context.subscriptions.push(this.disposable);
    }

    /** Dispose of the document symbol provider. @see {@link vscode.Disposable} */
    public static dispose() {
        this.disposable?.dispose();
    }

    // INSTANCE
    // --------

    /** The CSV parser */
    private parser = new VSCSV();

    public provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {

        /** Range of the entire document. Used in the {@linkcode documentSymbol} */
        const entireRange = new vscode.Range(0, 0, document.lineCount, Number.MAX_VALUE);

        /**
         * This {@link vscode.DocumentSymbol | symbol} will be the parent of all other symbols in the document
         * providing a range that spans the entire document. This allows the
         * first row (header row) to remain visible when scrolling through the document.
         * @see {@link vscode.DocumentSymbol}
         */
        const documentSymbol: vscode.DocumentSymbol = new vscode.DocumentSymbol(
            document.fileName,
            document.languageId,
            vscode.SymbolKind.File,
            entireRange,
            entireRange,
        );

        // Parse the CSV document
        const csv = this.parser.parse(document.getText());

        // Iterate over the rows in the CSV document...
        for (const r in csv.data) {
            const row = csv.data[r];
            if (!row.length) { continue; } // Exit if the row is empty

            // Create a symbol for the row
            const range = new vscode.Range(+r, 0, +r, Number.MAX_VALUE); // Range of the entire row
            const rowSymbol: vscode.DocumentSymbol = new vscode.DocumentSymbol(
                r,
                document.getText(range),
                vscode.SymbolKind.Array,
                range,
                range,
            );

            // Iterate over the cells in the row...
            for (const c in row) {
                const cell = row[c];
                if (!cell.value) { continue; } // Exit if the cell is empty

                // Create a symbol for the cell and add it to the row symbol
                const range = new vscode.Range(cell.line, cell.column, cell.line, cell.columnEnd);
                const cellSymbol = new vscode.DocumentSymbol(
                    r + ":" + c + " " + csv.headers[c].value + ": " + cell.value,
                    csv.headers[c].value || cell.value,
                    vscode.SymbolKind.String,
                    range,
                    range,
                );
                rowSymbol.children.push(cellSymbol);
            }

            // Add the row symbol to the document symbol
            documentSymbol.children.push(rowSymbol);
        }

        // Return the symbols
        return [documentSymbol];
    }

}
