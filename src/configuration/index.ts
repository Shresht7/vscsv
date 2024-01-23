// Library
import * as vscode from 'vscode';
import { Settings, SettingsKey } from './settings';
import { EXTENSION_ID } from '../constants';

// -------------
// CONFIGURATION
// -------------

/**
 * Responsible for retrieving the configuration from the vscode workspace configuration
 * and calling the registered listeners when the configuration is changed.
 */
export class Configuration {

    /**
     * Retrieve the value of the configuration key from the vscode workspace configuration
     * @param name The name of the configuration key to get
     * @returns The value of the configuration key (or undefined if it does not exist)
     */
    static get<K extends SettingsKey>(name: K): typeof Settings[K] | undefined {
        return vscode.workspace.getConfiguration(EXTENSION_ID).get(name);
    }

    /** Map the configuration keys to callback functions that are called when the configuration is changed */
    static Listeners = new Map<SettingsKey, Listener<any>>();

    /**
     * Register a listener for the given configuration key
     * @param name The name of the configuration key to listen to
     * @param listener The listener to register
     */
    static registerListener<K extends SettingsKey>(name: K, listener: Listener<typeof Settings[K]>) {
        this.Listeners.set(name, listener);
    }

    /** Whether or not the configuration has been initialized */
    private static _initialized = false;

    /** Initialize the configuration listeners */
    static initialize(context: vscode.ExtensionContext) {
        if (this._initialized) { return; } // Exit early if already initialized

        // Register the configuration listener
        vscode.workspace.onDidChangeConfiguration((e) => {

            // Check if any of our configuration keys have changed ...
            for (const k in Settings) {
                const key = k as SettingsKey;
                const id = `${EXTENSION_ID}.${key}` as const;
                if (e.affectsConfiguration(id)) {

                    // ... and call the registered listener for that key
                    const callback = this.Listeners.get(key);
                    const value = this.get(key);
                    callback?.(value);

                }
            }

        });

        this._initialized = true; // Set the initialized flag
    }

};

// -------------
// UTILITY TYPES
// -------------

/** A callback function that is called when the configuration is changed */
type Listener<T extends any> = (value: T) => void;

/** Get the configuration id for the given string */
type ID<T extends string> = `${typeof EXTENSION_ID}.${T}`;

/** Extract the name of the configuration key */
type ExtractName<T extends string> = T extends `${infer _}.${infer Name}` ? Name : never;
