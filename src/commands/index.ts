// Library
import * as vscode from 'vscode';
import { EXTENSION_ID } from '../constants';

// Commands
import { showPreview } from './showPreview';

// --------
// COMMANDS
// --------

export class Commands {

    /** All the commands for the extension */
    private static commands = {
        showPreview
    } as const;

    /** Boolean indicating whether or not the commands have been initialized */
    private static _initialized = false;

    /** Initialize all the commands for the extension */
    public static initialize(context: vscode.ExtensionContext) {
        if (!this._initialized) { return; } // Exit early if already initialized

        context.subscriptions.push(
            ...Object.entries(this.commands).map(([name, command]) => {
                const id = this.id(name as keyof typeof this.commands);
                return vscode.commands.registerCommand(id, () => command(context));
            })
        );

        this._initialized = true; // Set the initialized flag
    }

    /** Get the fully qualified command ID */
    public static id(name: keyof typeof this.commands) {
        return `${EXTENSION_ID}.${name}`;
    }

    /** Execute the command with the given command name */
    public static execute(name: keyof typeof this.commands) {
        return vscode.commands.executeCommand(this.id(name));
    }
}

