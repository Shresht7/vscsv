// Library
import * as vscode from 'vscode';
import {
	DocumentSemanticTokensProvider,
	DocumentSymbolProvider,
	HoverProvider,
} from './providers';

/** This method is called when your extension is activated */
export function activate(context: vscode.ExtensionContext) {

	vscode.window.showInformationMessage('CSV Extension is now active!');

	// Register the semantic tokens provider for the CSV language to provide syntax highlighting
	if (vscode.workspace.getConfiguration().get('vscsv.syntaxHighlighting')) {
		DocumentSemanticTokensProvider.initialize(context);
	}

	// Register the document symbol provider for the CSV language to provide symbol information
	DocumentSymbolProvider.initialize(context);

	// Register the hover provider for the CSV language to provide hover information
	HoverProvider.initialize(context);

}

/** This method is called when your extension is deactivated */
export function deactivate() { }
