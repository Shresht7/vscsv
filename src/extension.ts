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

	// Register the configuration listeners
	Configuration.initialize(context);

	// Register the semantic tokens provider for the CSV language to provide syntax highlighting
	if (Configuration.get('enableSyntaxHighlighting')) {
		DocumentSemanticTokensProvider.initialize(context);
	}
	Configuration.registerListener('enableSyntaxHighlighting', (value) => {
		if (value) {
			DocumentSemanticTokensProvider.initialize(context);
		} else {
			DocumentSemanticTokensProvider.dispose();
		}
	});

	// Register the document symbol provider for the CSV language to provide symbol information
	if (Configuration.get('enableDocumentSymbols')) {
		DocumentSymbolProvider.initialize(context);
	}
	Configuration.registerListener('enableDocumentSymbols', (value) => {
		if (value) {
			DocumentSymbolProvider.initialize(context);
		} else {
			DocumentSymbolProvider.dispose();
		}
	});

	// Register the hover provider for the CSV language to provide hover information
	if (Configuration.get('enableHoverInformation')) {
		HoverProvider.initialize(context);
	}
	Configuration.registerListener('enableHoverInformation', (value) => {
		if (value) {
			HoverProvider.initialize(context);
		} else {
			HoverProvider.dispose();
		}
	});

}

/** This method is called when your extension is deactivated */
export function deactivate() { }
