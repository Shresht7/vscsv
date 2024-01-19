// Library
import * as vscode from 'vscode';
import { VSCSV } from './library';

const CSV = new VSCSV();

// ---------
// HIGHLIGHT
// ---------

const tokenTypesLegend = [
    'comment', 'string', 'keyword', 'number', 'regexp', 'operator', 'namespace',
    'type', 'struct', 'class', 'interface', 'enum', 'typeParameter', 'function',
    'method', 'decorator', 'macro', 'variable', 'parameter', 'property', 'label'
];

const legend = new vscode.SemanticTokensLegend(tokenTypesLegend);


/**
 * Initialize the semantic tokens provider for the CSV language to provide syntax highlighting.
 * @param context The vscode extension context (see {@linkcode vscode.ExtensionContext})
 */
export function initialize(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider(
        { language: 'csv' },
        new DocumentSemanticTokensProvider(),
        legend
    ));
}

class DocumentSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens> {
        const csv = CSV.parse(document.getText());
        const builder = new vscode.SemanticTokensBuilder();
        csv.data.forEach((row) => {
            row.forEach((cell, columnNumber) => {
                builder.push(cell.line, cell.column, cell.columnEnd - cell.column, columnNumber);
            });
        });
        return builder.build();
    }
}
