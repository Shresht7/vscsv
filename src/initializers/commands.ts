// Library
import * as vscode from 'vscode';
import { commands } from '../commands';
import { EXTENSION_ID } from '../constants';

// --------
// COMMANDS
// --------

/** Initialize all the commands for the extension */
export function initialize(context: vscode.ExtensionContext) {
    commands.forEach(command => {
        const commandID = `${EXTENSION_ID}.${command.name}`;
        context.subscriptions.push(
            vscode.commands.registerCommand(commandID, command)
        );
    });
}
