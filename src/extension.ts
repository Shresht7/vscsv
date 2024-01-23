// Library
import * as vscode from 'vscode';

// Commands
import { Commands } from './commands';

// Configuration
import { Configuration } from './configuration';

// Providers
import {
	Diagnostics,
	HoverInformation,
	Symbols,
	SyntaxHighlighting
} from './providers';

// Webview
import { Webview } from './webview';

/** This method is called when your extension is activated */
export function activate(context: vscode.ExtensionContext) {

	vscode.window.showInformationMessage('CSV Extension is now active!');

	// Register the configuration listeners
	Configuration.initialize(context);

	// Register commands
	Commands.initialize(context);

	// Register the diagnostics provider to provide diagnostics
	Diagnostics.initialize(context);

	// Register the hover provider to provide hover information
	HoverInformation.initialize(context);

	// Register the document symbol provider to provide symbol information
	Symbols.initialize(context);

	// Register the semantic tokens provider provide syntax highlighting
	SyntaxHighlighting.initialize(context);

	// Register the webview provider to provide webview functionality
	Webview.initialize(context);

}

/** This method is called when your extension is deactivated */
export function deactivate() { }
