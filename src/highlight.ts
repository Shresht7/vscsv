// Library
import * as vscode from 'vscode';
import { VSCSV } from './library';

const CSV = new VSCSV();

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

/** A collection of legible colors to be used for highlighting */
const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
];

function applyHighlights(document: vscode.TextDocument) {

    const vscsv = CSV.parse(document.getText());

    vscsv.headers.forEach((header, idx) => {

        const decorationType = vscode.window.createTextEditorDecorationType({
            color: colors[idx % colors.length]
        });

        const ranges: vscode.Range[] = [];
        vscsv.getColumn(idx).forEach((cell) => {
            if (!cell) { return; }
            const range = new vscode.Range(
                cell.line,
                cell.column,
                cell.line,
                cell.columnEnd,
            );
            ranges.push(range);
        });

        vscode.window.activeTextEditor?.setDecorations(decorationType, ranges);

    });

}
