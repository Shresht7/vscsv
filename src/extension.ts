// Library
import * as vscode from 'vscode';

// Configuration
import { Configuration } from './configuration';

// Commands
import { Commands } from './commands';

// Providers
import {
	Diagnostics,
	HoverInformation,
	StatusBar,
	Symbols,
	SyntaxHighlighting,
} from './providers';

// --------
// ACTIVATE
// --------

/** This method is called when your extension is activated */
export function activate(context: vscode.ExtensionContext) {

	// Register the configuration manager
	Configuration.initialize(context);

	// Register the extension commands
	Commands.initialize(context);

	// Register the diagnostics provider to provide diagnostics
	Diagnostics.initialize(context);

	// Register the hover provider to provide hover information
	HoverInformation.initialize(context);

	// Register the document symbol provider to provide outline and go-to-symbol functionality
	Symbols.initialize(context);

	// Register the semantic tokens provider provide syntax-highlighting
	SyntaxHighlighting.initialize(context);

	// Register the status bar provider to provide status bar information
	StatusBar.initialize(context);

}

// ----------
// DEACTIVATE
// ----------

/** This method is called when your extension is deactivated */
export function deactivate() { }
