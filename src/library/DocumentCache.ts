// Library
import * as vscode from 'vscode';
import { VSCSV, Data, Cell } from './Parser';
import { language } from './helpers';

/**
 * A cache for parsed document data.
 */
export class DocumentCache {

    private static cache = new Map<string, Data<Cell>>();
    private static parser = new VSCSV();

    /**
     * Gets the parsed data for a document from the cache.
     * If the document is not in the cache, it will be parsed and added.
     * @param document The document to get the parsed data for.
     * @returns The parsed data for the document, or undefined if the language is not supported.
     */
    public static get(document: vscode.TextDocument): Data<Cell> | undefined {
        if (!language.isSupported(document.languageId)) {
            return undefined;
        }

        const uri = document.uri.toString();
        // Return from cache if it exists
        if (this.cache.has(uri)) {
            return this.cache.get(uri);
        }

        // Otherwise, update the cache and return the new data
        return this.update(document);
    }

    /**
     * Parses a document and updates its entry in the cache.
     * @param document The document to parse and update in the cache.
     * @returns The newly parsed data.
     */
    public static update(document: vscode.TextDocument): Data<Cell> | undefined {
        if (!language.isSupported(document.languageId)) {
            return undefined;
        }

        // Determine the delimiter and parse the document
        this.parser.determineDelimiter(document);
        const parsedData = this.parser.parse(document.getText());

        // Set the cache
        const uri = document.uri.toString();
        this.cache.set(uri, parsedData);

        return parsedData;
    }

    /**
     * Deletes a document from the cache.
     * @param document The document to delete from the cache.
     */
    public static delete(document: vscode.TextDocument): void {
        this.cache.delete(document.uri.toString());
    }

    /**
     * Initializes the document cache and subscribes to workspace events.
     * @param context The extension context.
     */
    public static initialize(context: vscode.ExtensionContext): void {
        // Update cache for currently active editor, if any
        if (vscode.window.activeTextEditor) {
            this.update(vscode.window.activeTextEditor.document);
        }

        context.subscriptions.push(
            // Update cache when a document is changed
            vscode.workspace.onDidChangeTextDocument(e => {
                this.update(e.document);
            }),

            // Delete from cache when a document is closed
            vscode.workspace.onDidCloseTextDocument(doc => {
                this.delete(doc);
            }),

            // Update cache for active editor when it changes
            vscode.window.onDidChangeActiveTextEditor(editor => {
                if (editor) {
                    this.get(editor.document); // Use get instead of update to avoid unnecessary parsing
                }
            })
        );
    }
}
