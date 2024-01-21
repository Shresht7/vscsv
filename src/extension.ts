// Library
import * as vscode from 'vscode';
import { Configuration } from './configuration';
import { DocumentSymbols, HoverInformation, SyntaxHighlighting } from './initializers';

/** This method is called when your extension is activated */
export function activate(context: vscode.ExtensionContext) {

	vscode.window.showInformationMessage('CSV Extension is now active!');

	// Register the configuration listeners
	Configuration.initialize(context);

	// Register the semantic tokens provider for the CSV language to provide syntax highlighting
	SyntaxHighlighting.initialize(context);

	// Register the document symbol provider for the CSV language to provide symbol information
	DocumentSymbols.initialize(context);

	// Register the hover provider for the CSV language to provide hover information
	HoverInformation.initialize(context);

}

/** This method is called when your extension is deactivated */
export function deactivate() { }
