// Library
import * as vscode from 'vscode';
import { VSCSV } from '../../library';

// --------------------
// DIAGNOSTICS PROVIDER
// --------------------

export class DiagnosticsProvider {

    /**
     * This collection of diagnostics, once registered with vscode, will be displayed in the Problems panel
     * @see {@link vscode.DiagnosticCollection}
     */
    protected diagnostics: vscode.DiagnosticCollection;

    /** The parser to use for parsing the document */
    private parser: VSCSV;

    constructor(
        /** The name of the language for which this provider provides diagnostics */
        private languageId: string,
        delimiter: string = ",",
    ) {
        this.diagnostics = vscode.languages.createDiagnosticCollection(this.languageId);
        this.parser = new VSCSV({ delimiter });
    }



    /**
     * Initializes the {@linkcode diagnostics} collection and subscribes to events.
     * This happens after the object has been created using the constructor, so that
     * all the properties have been properly initialized before they are used.
     * @param context The extension context ({@linkcode vscode.ExtensionContext})
     */
    initialize(context: vscode.ExtensionContext) {
        // Provide diagnostics for the active document
        if (vscode.window.activeTextEditor) {
            this.provideDiagnostics(vscode.window.activeTextEditor.document);
        }
        // Subscribe to events
        this.subscribeToEvents(context);
    }

    /** Dispose off the diagnostics provider */
    dispose() {
        this.diagnostics.dispose();
    }

    /**
     * Determines whether {@link diagnostics} are allowed for the given {@link vscode.TextDocument | text document}
     * @param document The {@link vscode.TextDocument | text document} to check ({@linkcode vscode.TextDocument})
     * @returns `true` if {@link diagnostics} are allowed for the given {@link vscode.TextDocument | text document}, `false` otherwise
     */
    private shouldProvideDiagnostics(document: vscode.TextDocument): boolean {
        return document && document.languageId === this.languageId;
    }

    /**
     * Provides {@link diagnostics} for the given {@link vscode.TextDocument | text document}
     * @param document The {@link vscode.TextDocument | text document} for which to provide {@link diagnostics} ({@linkcode vscode.TextDocument})
     */
    private provideDiagnostics(document: vscode.TextDocument) {
        if (document && this.shouldProvideDiagnostics(document)) {
            const diagnostics = this.getDiagnostics(document);
            this.diagnostics.set(document.uri, diagnostics);
        }
    }

    /**
     * Get the collection of diagnostics for the given document
     * @param document The document for which to provide diagnostics
     * @returns The collection of diagnostics for the given document
     */
    private getDiagnostics(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];

        const data = this.parser.parse(document.getText());

        const colLength = data.headers.length;

        for (const r in data) {
            const row = data[r];
            if (row.length !== colLength) {
                const range = new vscode.Range(+r, 0, +r, Number.MAX_VALUE);
                const diagnostic = new vscode.Diagnostic(
                    range,
                    `Expected ${colLength} columns, found ${row.length}`,
                    vscode.DiagnosticSeverity.Warning
                );
                diagnostics.push(diagnostic);
            }
        }

        return diagnostics;
    }


    /**
     * Subscribe to events that will trigger diagnostics
     * @param context The extension context ({@linkcode vscode.ExtensionContext})
     */
    private subscribeToEvents(context: vscode.ExtensionContext) {
        context.subscriptions.push(

            // Update diagnostics when the active document changes
            vscode.window.onDidChangeActiveTextEditor(editor => {
                if (editor) {
                    this.provideDiagnostics(editor.document);
                }
            }),

            // Update diagnostics when the document is changed
            // vscode.workspace.onDidChangeTextDocument(event => {
            //     this.provideDiagnostics(event.document);
            // }),

            // Update diagnostics when the document is saved
            vscode.workspace.onDidSaveTextDocument(document => {
                this.provideDiagnostics(document);
            }),

            // Clear diagnostics when the document is closed
            vscode.workspace.onDidCloseTextDocument(document => {
                this.diagnostics.delete(document.uri);
            }),

        );
    }

}
