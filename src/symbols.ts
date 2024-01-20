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

        /**
         * This {@link vscode.DocumentSymbol | symbol} will be the parent of all other symbols in the document
         * providing a range that spans the entire document. This allows the
         * first row (header row) to remain visible when scrolling through the document.
         * @see {@link vscode.DocumentSymbol}
         */
        const documentSymbol = this.createDocumentSymbol(document);

        // Parse the CSV document
        const csv = this.parser.parse(document.getText());

        // Iterate over the rows in the CSV document...
        csv.data.forEach((row, r) => {
            if (!row.length) { return; } // Exit if the row is empty

            // Create a symbol for the row
            const rowSymbol = this.createRowSymbol(document, r);

            // Iterate over the cells in the row...
            row.forEach((cell, c) => {
                if (!cell.value) { return; } // Exit if the cell is empty

                // Create a symbol for the cell and add it to the row symbol
                const cellSymbol = this.createCellSymbol(
                    cell.value,
                    cell.range,
                    r,
                    c,
                    csv.getHeader(c)?.value
                );

                rowSymbol.children.push(cellSymbol);
            });

            // Add the row symbol to the document symbol
            documentSymbol.children.push(rowSymbol);
        });

        // Return the symbols
        return [documentSymbol];
    }

    /** Creates a symbol for the {@link vscode.TextDocument | document} */
    private createDocumentSymbol(document: vscode.TextDocument): vscode.DocumentSymbol {
        /** Range of the entire document. Used in the {@linkcode documentSymbol} */
        const entireRange = new vscode.Range(0, 0, document.lineCount, Number.MAX_VALUE);

        // Create a symbol for the document and return it        
        const documentSymbol: vscode.DocumentSymbol = new vscode.DocumentSymbol(
            document.fileName,
            document.languageId,
            vscode.SymbolKind.File,
            entireRange,
            entireRange,
        );
        return documentSymbol;
    }

    /**
     * Creates a symbol for a row in the CSV document.
     * @param document The {@link vscode.TextDocument | document} to create the symbol for
     * @param index The index of the row in the CSV document
     */
    private createRowSymbol(document: vscode.TextDocument, index: number): vscode.DocumentSymbol {
        const range = new vscode.Range(index, 0, index, Number.MAX_VALUE); // Range of the entire row
        const rowSymbol: vscode.DocumentSymbol = new vscode.DocumentSymbol(
            index.toString(),
            document.getText(range),
            vscode.SymbolKind.Array,
            range,
            range,
        );
        return rowSymbol;
    }

    /**
     * Creates a symbol for a cell in the CSV document.
     * @param value The value of the cell
     * @param range The range of the cell (see {@linkcode vscode.Range})
     * @param row The row index of the cell
     * @param column The column index of the cell
     * @param header The header of the column the cell is in (if any)
     */
    private createCellSymbol(value: string, range: vscode.Range, row: number, column: number, header: string = ""): vscode.DocumentSymbol {
        const nameInfo = header ? value : header + ": " + value;
        const cellSymbol = new vscode.DocumentSymbol(
            row + ":" + column + " " + nameInfo,
            header || value,
            vscode.SymbolKind.String,
            range,
            range,
        );
        return cellSymbol;
    }

}
