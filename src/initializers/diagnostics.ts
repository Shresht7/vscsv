// Library
import * as vscode from 'vscode';
import { DiagnosticsProvider } from '../providers';

// -----------
// DIAGNOSTICS
// -----------

/** Initialize the diagnostics provider */
export function initialize(context: vscode.ExtensionContext) {

    // Register the diagnostics provider to provide diagnostics
    DiagnosticsProvider.initialize(context);

}
