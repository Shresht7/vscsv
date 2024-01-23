// Library
import { Table } from "./table";

const table = new Table('table');

// Listen for messages from the main thread and render the table 
window.addEventListener('message', (event) => {

    const message = /** @type any[] */ (event.data);
    switch (message.command) {

        case 'update':
            handleUpdate(message.data);
            break;
    }
});

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
