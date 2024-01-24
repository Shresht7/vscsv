// Library
import * as vscode from 'vscode';
import { language } from '../library/helpers';

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
            this.update(vscode.window.activeTextEditor.document);
        }

        vscode.window.onDidChangeActiveTextEditor((e) => {
            if (!e) { return; }
            this.update(e?.document);
        });

        vscode.workspace.onDidOpenTextDocument((e) => {
            this.update(e);
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
            this.item.text = `Row ${cursor?.line + 1}, Col ${cursor?.character + 1}`;
            this.item.show();
        }
    }

    /** Hide the status bar item */
    private static hide() {
        this.item.hide();
    }

}
