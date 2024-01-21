// Library
import * as vscode from 'vscode';
import { Configuration } from './configuration';
import {
	DocumentSemanticTokensProvider,
	DocumentSymbolProvider,
	HoverProvider,
} from './providers';

/** This method is called when your extension is activated */
export function activate(context: vscode.ExtensionContext) {

	vscode.window.showInformationMessage('CSV Extension is now active!');

	// Register the semantic tokens provider for the CSV language to provide syntax highlighting
	if (Configuration.get('enableSyntaxHighlighting')) {
		DocumentSemanticTokensProvider.initialize(context);
	}

	// Register the document symbol provider for the CSV language to provide symbol information
	DocumentSymbolProvider.initialize(context);

	// Register the hover provider for the CSV language to provide hover information
	HoverProvider.initialize(context);

	// Register the configuration listeners
	Configuration.initialize(context);

	Configuration.registerListener('enableSyntaxHighlighting', (value) => {
		if (value) {
			DocumentSemanticTokensProvider.initialize(context);
		} else {
			DocumentSemanticTokensProvider.dispose();
		}
	});

}

/** This method is called when your extension is deactivated */
export function deactivate() { }
