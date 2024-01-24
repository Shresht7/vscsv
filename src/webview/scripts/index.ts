// Library
import { Table } from "./table";

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

function main() {
    const table = new Table('table');

    function handleUpdate(payload: string[][]) {
        // Clear the table
        table.clear();

        // Return early if there is no data
        if (payload?.length < 1) { return; }

        // Create the header row
        const headers = payload.shift()!;
        table.addHeaderRow(headers);

        // Create the data rows
        for (const row of payload) {
            table.addDataRow(row);
        }
    }

    // Listen for messages from the main thread and render the table 
    window.addEventListener('message', (event) => {

        const message = /** @type any[] */ (event.data);
        switch (message.command) {

            case 'update':
                handleUpdate(message.data);
                break;
        }
    });
}
