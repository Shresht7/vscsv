// Library
import * as vscode from 'vscode';
import { Settings, SettingsKey } from './settings';
import { EXTENSION_ID } from '../library';

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
    public static get<K extends SettingsKey>(name: SettingsKey): typeof Settings[K] | undefined {
        return vscode.workspace.getConfiguration(EXTENSION_ID).get(name);
    }

    /** Map the configuration keys to callback functions that are called when the configuration is changed */
    private static listeners: Partial<Record<SettingsKey, Listener<any>>> = {};

    /**
     * Register a listener for the given configuration key. The listener is called when this configuration is changed.
     * @param name The name of the configuration key to listen to
     * @param listener The listener to register for the given configuration key
     */
    public static registerListener<K extends SettingsKey>(name: K, listener: Listener<typeof Settings[K]>) {
        this.listeners[name] = listener;
    }

    /**
     * Initializes the extension by registering the configuration change listener.
     * This listener checks if any of the configuration keys have changed and calls the registered listener for that key.
     * @param context The extension context provided by Visual Studio Code.
     */
    public static initialize(context: vscode.ExtensionContext) {

        // Register the configuration change listener
        vscode.workspace.onDidChangeConfiguration((e) => {

            // Check if any of our configuration keys have changed ...
            for (const k in Settings) {
                const key = k as SettingsKey;
                const id = `${EXTENSION_ID}.${key}` as const;
                if (e.affectsConfiguration(id)) {

                    // ... and call the registered listener for that key
                    const callback = this.listeners[key];
                    const value = this.get(key);
                    callback?.(value);

                }
            }

        });

    }

};

// -------------
// UTILITY TYPES
// -------------

/** A callback function that is called when the configuration is changed */
type Listener<T> = (value: T) => void;
