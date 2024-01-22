// Library
import * as vscode from 'vscode';
import { Webview } from '../views';

// --------------------
// SHOW PREVIEW COMMAND
// --------------------

/** This method is called when the "Show Preview" command is executed */
export function showPreview(context: vscode.ExtensionContext) {
    Webview.render(context.extensionUri);
}
