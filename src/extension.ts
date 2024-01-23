// Library
import * as vscode from 'vscode';
import { Configuration } from './configuration';
import { Commands } from './commands';
import {
	Diagnostics,
	Symbols,
	SyntaxHighlighting,
	HoverInformation
} from './providers';
import { Webview } from './webview';

/** This method is called when your extension is activated */
export function activate(context: vscode.ExtensionContext) {

	vscode.window.showInformationMessage('CSV Extension is now active!');

	// Register the configuration listeners
	Configuration.initialize(context);

	// Initialize Commands
	Commands.initialize(context);

	// Register the diagnostics provider
	Diagnostics.initialize(context);

	// Register the hover provider  provide hover information
	HoverInformation.initialize(context);

	// Register the document symbol provider to provide symbol information
	Symbols.initialize(context);

	// Register the semantic tokens provider provide syntax highlighting
	SyntaxHighlighting.initialize(context);

	// Register the webview provider
	Webview.initialize(context);

}

/** This method is called when your extension is deactivated */
export function deactivate() { }
