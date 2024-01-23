// Library
import * as vscode from 'vscode';
import { HoverProvider } from './classes';
import { Configuration } from '../configuration';

// -----------------
// HOVER INFORMATION
// -----------------

export class HoverInformation {

    public static initialize(context: vscode.ExtensionContext) {

        // Register the hover provider to provide hover information
        if (Configuration.get('enableHoverInformation')) {
            HoverProvider.initialize(context);
        }

        // Register the configuration listener for the `enableHoverInformation` setting
        Configuration.registerListener('enableHoverInformation', (value) => {
            if (value) {
                HoverProvider.initialize(context);
            } else {
                HoverProvider.dispose();
            }
        });


    }

}
