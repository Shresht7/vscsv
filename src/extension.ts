// Library
import * as vscode from 'vscode';
import { initialize } from './highlight';

/** This method is called when your extension is activated */
export function activate(context: vscode.ExtensionContext) {

	vscode.window.showInformationMessage('CSV Extension is now active!');

	initialize(context);

}

/** This method is called when your extension is deactivated */
export function deactivate() { }
