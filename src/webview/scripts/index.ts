// Library
import { Table } from "./table";
import type { VSCodeMessage, WebviewMessage } from "../types";

// Get access to the VS Code API from within the webview context
// @ts-ignore - The VS Code API is provided by vscode-webview api
const vscode = acquireVsCodeApi();

// ---------
// PAGE LOAD
// ---------

// Send a "ready" message to the main thread when the page loads and continue with main()
window.addEventListener('load', () => {
    postMessage({ command: 'ready', data: true });
    main();
});

// ----
// MAIN
// ----

/** The class representing the html table */
const table = new Table('table');

/** The main function */
function main() {
    // Listen for messages from the main thread and render the table 
    window.addEventListener('message', handleMessageEvent);
}

// ---------------------
// MESSAGE EVENT HANDLER
// ---------------------

/** Message Event Handler */
function handleMessageEvent(event: MessageEvent<VSCodeMessage>) {
    const message = event.data;
    switch (message.command) {
        case 'update':
            table.update(message.data);
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
