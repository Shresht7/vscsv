// Library
import * as vscode from 'vscode';
import { DocumentCache, language } from '../library';

// -------------------
// STATUS BAR PROVIDER
// -------------------

export class StatusBar {

    /** Alignment of the status bar item */
    private static alignment: vscode.StatusBarAlignment = vscode.StatusBarAlignment.Right;

    /** Priority of the status bar item */
    private static priority: number = 10000;

    /** The status bar item */
    private static item = vscode.window.createStatusBarItem(this.alignment, this.priority);

    public static initialize(context: vscode.ExtensionContext) {
        context.subscriptions.push(this.item);

        // Subscribe to events
        this.subscribeToEvents();

        // Update status bar for the active editor
        if (vscode.window.activeTextEditor) {
            this.update(vscode.window.activeTextEditor.document);
        }
    }

    /** Subscribe to events to control the status bar item */
    private static subscribeToEvents() {
        // Update status bar when the selection changes
        vscode.window.onDidChangeTextEditorSelection((e) => {
            this.update(e.textEditor.document);
        });

        // Update status bar when the active editor changes
        vscode.window.onDidChangeActiveTextEditor((e) => {
            if (e) {
                this.update(e.document);
            } else {
                this.hide();
            }
        });
    }

    /** Show the status bar item */
    public static show() {
        this.item.show();
    }

    /** Update the status bar item */
    private static update(document: vscode.TextDocument) {
        // Return early if the document is not a supported language
        if (!language.isSupported(document.languageId)) {
            this.hide();
            return;
        }

        // Get the cursor position and parsed data from the cache
        const cursor = vscode.window.activeTextEditor?.selection.active;
        const csv = DocumentCache.get(document);
        if (!cursor || !csv) { return; }

        // Find the cell that contains the cursor
        let r = -1;
        let c = -1;
        for (let i = 0; i < csv.length; i++) {
            const row = csv[i];
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                if (cell.range.contains(cursor)) {
                    r = i + 1;
                    c = j + 1;
                    break;
                }
            }
            if (r !== -1) { break; }
        }

        // Update the status bar item text
        if (r !== -1) {
            this.item.text = `Row ${r}, Column ${c}`;
            this.show();
        } else {
            this.hide();
        }
    }

    /** Hide the status bar item */
    private static hide() {
        this.item.hide();
    }

}
