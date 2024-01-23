// Library
import * as vscode from 'vscode';
import { DiagnosticsProvider } from './classes';
import { Configuration } from '../configuration';

// -----------
// DIAGNOSTICS
// -----------

export class Diagnostics {

    /** The collection of diagnostics providers */
    private static diagnosticsProviders = [
        new DiagnosticsProvider('csv', ","),
        new DiagnosticsProvider('tsv', "\t"),
    ];

    /** Initialize the diagnostics providers */
    public static initialize(context: vscode.ExtensionContext) {

        // Register the diagnostics providers to provide diagnostics
        if (Configuration.get('enableDiagnostics')) {
            this.diagnosticsProviders.forEach(p => p.initialize(context));
        }

        // Register the configuration listener for `enableDiagnostics` setting
        Configuration.registerListener('enableDiagnostics', (value) => {
            if (value) {
                this.diagnosticsProviders.forEach(p => p.initialize(context));
            } else {
                this.diagnosticsProviders.forEach(p => p.dispose());
            }
        });

    }

}
