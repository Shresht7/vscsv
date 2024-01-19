// Library
import * as vscode from 'vscode';

// ---------
// HIGHLIGHT
// ---------

export function initialize(context: vscode.ExtensionContext) {

    if (vscode.window.activeTextEditor?.document) {
        const document = vscode.window.activeTextEditor.document;
        if (document.languageId === 'csv') {
            applyHighlights(document);
        }
    }

    // Subscribe to events
    context.subscriptions.push(
        // Apply highlights when the active text editor changes to a CSV file
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor?.document.languageId === 'csv') {
                applyHighlights(editor.document);
            }
        }),
        // Apply highlights when the active text editor's document changes
        vscode.workspace.onDidChangeTextDocument((event) => {
            if (event.document.languageId === 'csv') {
                applyHighlights(event.document);
            }
        }),
    );

}

function applyHighlights(document: vscode.TextDocument) {
    console.log('Applying highlights to CSV file');
}
