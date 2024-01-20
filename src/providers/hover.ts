// Library
import * as vscode from 'vscode';
import { Cell, VSCSV } from '../library';

// --------------
// HOVER PROVIDER
// --------------

export class HoverProvider implements vscode.HoverProvider {

    // STATIC
    // ------

    /** The document selector for the CSV language */
    private static selector: vscode.DocumentSelector = { language: 'csv' };

    /** The disposable used to unregister this provider, when needed */
    private static disposable: vscode.Disposable;

    /**
     * Initialize the hover provider for the CSV language to provide hover information.
     * @param context The vscode extension context (see {@linkcode vscode.ExtensionContext})
     * @see {@link vscode.languages.registerHoverProvider}
     * @see {@link vscode.HoverProvider}
     */
    public static initialize(context: vscode.ExtensionContext) {
        this.disposable?.dispose(); // Dispose of any existing provider
        // Register the hover provider for the CSV language to provide hover information
        this.disposable = vscode.languages.registerHoverProvider(this.selector, new HoverProvider());
        // Register the disposable to dispose of the provider when the extension is deactivated
        context.subscriptions.push(this.disposable);
    }

    /** Dispose of the hover provider. @see {@link vscode.Disposable} */
    public static dispose() {
        this.disposable?.dispose();
    }

    // INSTANCE
    // --------

    /** The CSV parser */
    private parser = new VSCSV();

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {

        // Parse the document
        const csv = this.parser.parse(document.getText());

        // Iterate over the cells in the CSV document...
        for (const r in csv.data) {
            for (const c in csv.data[r]) {
                // ...get the cell...
                const cell = csv.getCell(+r, +c);
                if (!cell) { continue; } // Skip empty cells

                // ...and return a hover if the cell contains the hovered position
                if (cell.range.contains(position)) {
                    return new vscode.Hover(this.determineHoverContents(
                        document.lineAt(+r).text,
                        +r,
                        +c,
                        csv.getHeader(+c)?.value
                    ));
                }
            }
        }

        // Return null if no hover is provided
        return null;

    }

    /**
     * Determines the hover contents for the given row and column
     * @returns A markdown string or array of markdown strings to display in the hover
     */
    determineHoverContents(line: string, row: number, column: number, header: string = ""): vscode.MarkdownString | (vscode.MarkdownString)[] {
        header = header ? ` (${header})` : '';
        const string = [
            line,
            `Row: ${row + 1}, Column: ${column + 1}${header}`
        ];
        return string.map(s => new vscode.MarkdownString(s));
    }

}
