// Library
import * as vscode from 'vscode';
import { DiagnosticsProvider } from '../providers';
import { Configuration } from '../configuration';

// -----------
// DIAGNOSTICS
// -----------

/** Initialize the diagnostics provider */
export function initialize(context: vscode.ExtensionContext) {

    // Register the diagnostics provider to provide diagnostics
    if (Configuration.get('enableDiagnostics')) {
        DiagnosticsProvider.initialize(context);
    }

    // Register the configuration listener for `enableDiagnostics` setting
    Configuration.registerListener('enableDiagnostics', (value) => {
        if (value) {
            DiagnosticsProvider.initialize(context);
        } else {
            DiagnosticsProvider.dispose();
        }
    });

}
