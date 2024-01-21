// Library
import * as vscode from 'vscode';
import { HoverProvider } from '../providers';
import { Configuration } from '../configuration';

// -----------------
// HOVER INFORMATION
// -----------------

export function initialize(context: vscode.ExtensionContext) {

    if (Configuration.get('enableHoverInformation')) {
        HoverProvider.initialize(context);
    }

    Configuration.registerListener('enableHoverInformation', (value) => {
        if (value) {
            HoverProvider.initialize(context);
        } else {
            HoverProvider.dispose();
        }
    });

}
