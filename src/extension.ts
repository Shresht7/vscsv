// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	vscode.window.showInformationMessage('CSV Extension is now active!');

	if (vscode.window.activeTextEditor?.document) {
		const document = vscode.window.activeTextEditor.document;
		if (document.fileName.endsWith(".csv")) {
			console.log(parseCsv(document.getText()));
		}
	}

}

// This method is called when your extension is deactivated
export function deactivate() { }

/**
 * Parses a csv document into a 2D array
 * @param doc The csv document to parse
 * @returns A 2D array of the csv document
 */
function parseCsv(doc: string): string[][] {
	/** The resulting 2D array */
	let result: string[][] = [];

	// Split the document into lines
	const lines = doc.split("\n");

	// Iterate over each line and split it into columns
	for (const line of lines) {
		result.push(line.split(","));
	}

	// Return the result
	return result;
}
