// Library
import * as vscode from 'vscode';
import { DocumentSemanticTokensProvider } from './highlight';

/** This method is called when your extension is activated */
export function activate(context: vscode.ExtensionContext) {

	vscode.window.showInformationMessage('CSV Extension is now active!');

	// Register the semantic tokens provider for the CSV language to provide syntax highlighting
	DocumentSemanticTokensProvider.initialize(context);

}

/** This method is called when your extension is deactivated */
export function deactivate() { }
