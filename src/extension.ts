// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { parseCsv } from './csv';

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
