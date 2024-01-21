// Library
import * as vscode from 'vscode';

// -------------
// CONFIGURATION
// -------------

/** The identifier of the extension */
const EXTENSION_ID = 'vscsv' as const;

export class Configuration {

    /** Maps the configuration keys to their default values */
    static Settings = {
        enableSyntaxHighlighting: true,
    };

    /**
     * Retrieve the value of the configuration key from the vscode workspace configuration
     * @param name The name of the configuration key to get
     * @returns The value of the configuration key (or undefined if it does not exist)
     */
    static get<K extends keyof typeof this.Settings>(name: K): typeof this.Settings[K] | undefined {
        return vscode.workspace.getConfiguration(EXTENSION_ID).get(name);
    }

}

// -------------
// UTILITY TYPES
// -------------

/** Get the configuration id for the given string */
type ID<T extends string> = `${typeof EXTENSION_ID}.${T}`;

/** Extract the name of the configuration key */
type ExtractName<T extends string> = T extends `${infer _}.${infer Name}` ? Name : never;
