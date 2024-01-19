// Library
import * as vscode from 'vscode';

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

    public provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.SymbolInformation[] | vscode.DocumentSymbol[]> {
        return [];
    }

}
