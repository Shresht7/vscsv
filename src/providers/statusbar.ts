// Library
import * as vscode from 'vscode';
import { language } from '../library/helpers';
import { Parser, VSCSV } from '../library';

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

        if (vscode.window.activeTextEditor) {
            if (language.isSupported(vscode.window.activeTextEditor.document.languageId)) {
                this.update(vscode.window.activeTextEditor.document);
                this.show();
            }
        }

        vscode.window.onDidChangeTextEditorSelection((e) => {
            e.selections.forEach((selection) => {
                this.update(e?.textEditor.document);
            });
        });

        vscode.window.onDidChangeActiveTextEditor((e) => {
            if (!e) { return; }
            if (language.isSupported(e.document.languageId)) {
                this.show();
            }
        });

        vscode.workspace.onDidOpenTextDocument((e) => {
            if (!e) { return; }
            if (language.isSupported(e.languageId)) {
                this.show();
            }
        });

        vscode.workspace.onDidCloseTextDocument((e) => {
            this.hide();
        });
    }

    /** Show the status bar item */
    public static show() {
        this.item.show();
    }

    /** Update the status bar item */
    private static update(document: vscode.TextDocument) {
        if (language.isSupported(document.languageId)) {
            // Get cursor position
            const cursor = vscode.window.activeTextEditor?.selection.active;
            if (!cursor) { return; }
            const r = cursor.line + 1;
            const row = document.lineAt(cursor.line).text;
            const cols = new VSCSV().parse(row)[0];
            const colIdx = cols.findIndex((col) => col.range.contains(new vscode.Position(0, cursor.character)));
            const c = colIdx + 1;
            // Update status bar item
            this.item.text = `Row ${r}, Column ${c}`;
        }
    }

    /** Hide the status bar item */
    private static hide() {
        this.item.hide();
    }

}
