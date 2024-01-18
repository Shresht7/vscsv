// Library
import * as vscode from 'vscode';
import { CSV } from './library';

/** This method is called when your extension is activated */
export function activate(context: vscode.ExtensionContext) {

	vscode.window.showInformationMessage('CSV Extension is now active!');

	if (vscode.window.activeTextEditor?.document) {
		const document = vscode.window.activeTextEditor.document;
		if (document.fileName.endsWith(".csv")) {
			console.log(CSV.parse(document.getText()));
		}
	}

}

/** This method is called when your extension is deactivated */
export function deactivate() { }
