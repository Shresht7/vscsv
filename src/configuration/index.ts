// Library
import * as vscode from 'vscode';
import { EXTENSION_ID } from '../constants';

// -------------
// CONFIGURATION
// -------------

/**
 * Responsible for retrieving the configuration from the vscode workspace configuration
 * and calling the registered listeners when the configuration is changed.
 */
export class Configuration {

    /** Maps the configuration keys to their default values */
    static Settings = {
        enableSyntaxHighlighting: true,
        enableDocumentSymbols: true,
        enableHoverInformation: true,
        enableDiagnostics: true,
    };

    /**
     * Retrieve the value of the configuration key from the vscode workspace configuration
     * @param name The name of the configuration key to get
     * @returns The value of the configuration key (or undefined if it does not exist)
     */
    static get<K extends keyof typeof this.Settings>(name: K): typeof this.Settings[K] | undefined {
        return vscode.workspace.getConfiguration(EXTENSION_ID).get(name);
    }

    /** Map the configuration keys to callback functions that are called when the configuration is changed */
    static Listeners = new Map<keyof typeof this.Settings, Listener<any>>();

    /**
     * Register a listener for the given configuration key
     * @param name The name of the configuration key to listen to
     * @param listener The listener to register
     */
    static registerListener<K extends keyof typeof this.Settings>(name: K, listener: Listener<typeof this.Settings[K]>) {
        this.Listeners.set(name, listener);
    }

    /** Initialize the configuration listeners */
    static initialize(context: vscode.ExtensionContext) {
        vscode.workspace.onDidChangeConfiguration((e) => {

            // Check if any of our configuration keys have changed ...
            for (const k in this.Settings) {
                const key = k as keyof typeof this.Settings;
                const id = `${EXTENSION_ID}.${key}` as const;
                if (e.affectsConfiguration(id)) {

                    // ... and call the registered listener for that key
                    const callback = this.Listeners.get(key);
                    const value = this.get(key);
                    callback?.(value);

                }
            }

        });
    }

}

// -------------
// UTILITY TYPES
// -------------

/** A callback function that is called when the configuration is changed */
type Listener<T extends any> = (value: T) => void;

/** Get the configuration id for the given string */
type ID<T extends string> = `${typeof EXTENSION_ID}.${T}`;

/** Extract the name of the configuration key */
type ExtractName<T extends string> = T extends `${infer _}.${infer Name}` ? Name : never;
