// Library
import * as vscode from 'vscode';
import { VSCSV } from './library';

// -------
// SYMBOLS
// -------

export class DocumentSymbolProvider implements vscode.DocumentSymbolProvider {

    // STATIC
    // ------

    /** The disposable used to unregister this provider */
    private static disposable: vscode.Disposable;

    /**
     * Initialize the document symbol provider for the CSV language to provide symbol information.
     * @param context The vscode extension context (see {@linkcode vscode.ExtensionContext})
     */
    public static initialize(context: vscode.ExtensionContext) {
        this.dispose(); // Dispose of any existing provider
        // Register the document symbol provider for the CSV language to provide symbol information
        this.disposable = vscode.languages.registerDocumentSymbolProvider(
            { language: 'csv' },
            new DocumentSymbolProvider()
        );
        // Register the disposable to dispose of the provider when the extension is deactivated
        context.subscriptions.push(this.disposable);
    }

    /** Dispose of the document symbol provider */
    public static dispose() {
        this.disposable?.dispose();
    }

    // INSTANCE
    // --------

    private parser = new VSCSV();

    public provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {

        // Initialize the symbols array
        const symbols: vscode.DocumentSymbol[] = [];

        // Parse the CSV document
        const csv = this.parser.parse(document.getText());

        // Iterate over the rows in the CSV document...
        for (const r in csv.data) {
            const row = csv.data[r];
            if (!row.length) { continue; } // Exit if the row is empty

            // Create a symbol for the row and add it to the symbols array
            const range = new vscode.Range(+r, 0, +r, Number.MAX_VALUE);
            const rowSymbols: vscode.DocumentSymbol = new vscode.DocumentSymbol(
                r,
                document.getText(range),
                vscode.SymbolKind.Array,
                range,
                range,
            );

            // Iterate over the cells in the row...
            for (const c in row) {
                const cell = row[c];
                if (!cell.value) { continue; }

                // Create a symbol for the cell and add it to the row symbol
                const range = new vscode.Range(cell.line, cell.column, cell.line, cell.columnEnd);
                const symbol = new vscode.DocumentSymbol(
                    r + ":" + c + " " + csv.headers[c].value + ": " + cell.value,
                    csv.headers[c].value || cell.value,
                    vscode.SymbolKind.Field,
                    range,
                    range,
                );
                rowSymbols.children.push(symbol);
            }

            // Add the row symbol to the symbols array
            symbols.push(rowSymbols);
        }

        // Return the symbols array
        return symbols;
    }

}
