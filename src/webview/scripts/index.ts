// Library
import { Table } from "./table";

// VS Code Webview UI Toolkit Components
import {
    provideVSCodeDesignSystem,
    vsCodeDivider,
    vsCodeTextField,
} from '@vscode/webview-ui-toolkit';

// Type Definitions
import type { VSCodeMessage, WebviewMessage } from "../types";

// Register the VS Code Design System components
provideVSCodeDesignSystem().register(
    vsCodeDivider(),
    vsCodeTextField(),
);

// Get access to the VS Code API from within the webview context
// @ts-ignore - The VS Code API is provided by vscode-webview api
const vscode = acquireVsCodeApi();

// ---------
// PAGE LOAD
// ---------

// Event: Page Load
window.addEventListener('load', () => {
    postMessage({ command: 'ready', data: true }); // Notify the main thread that the webview is ready
    main(); // Call the main function
    // Restore the table state if it exists
    const state = vscode.getState();
    if (state) { table.update(state.data); }
});

// ----
// MAIN
// ----

/** The class representing the html table */
const table = new Table('table');

/** The search input element */
const search = document.getElementById('search') as HTMLInputElement;

/** The main function */
function main() {
    // Listen for messages from the main thread
    window.addEventListener('message', handleMessageEvent);

    // Listen for search input events and search the table
    search.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value;
        table.search(query);
    });
}

// ---------------------
// MESSAGE EVENT HANDLER
// ---------------------

/** Message Event Handler */
function handleMessageEvent(event: MessageEvent<VSCodeMessage>) {
    const message = event.data;
    switch (message.command) {
        case 'update':
            table.update(message.data); // Update the table with new data
            vscode.setState({ data: message.data }); // Save the table state
            break;
    }
}

// ----------------
// HELPER FUNCTIONS
// ----------------

/** Helper function to enforce type safety when posting messages to the main thread */
function postMessage(message: WebviewMessage) {
    vscode.postMessage(message);
}
