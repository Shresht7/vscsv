// Library
import { Table } from "./table";
import type { SendMessage } from "../types";

// Get access to the VS Code API from within the webview context
// @ts-ignore
const vscode = acquireVsCodeApi();

// ---------
// PAGE LOAD
// ---------

// Send a "ready" message to the main thread when the page loads and continue with main()
window.addEventListener('load', () => {
    vscode.postMessage({ command: 'ready' });
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

/** Message Event Handler */
function handleMessageEvent(event: MessageEvent<SendMessage>) {
    const message = event.data;
    switch (message.command) {
        case 'update':
            table.update(message.data);
            break;
    }
}
