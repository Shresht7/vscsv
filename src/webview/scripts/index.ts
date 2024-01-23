// Library
import { createRow } from "./helpers";

// DOM ELEMENTS
const table = document.getElementById('table')! as HTMLTableElement;

// Listen for messages from the main thread and render the table 
window.addEventListener('message', (event) => {

    const message = /** @type any[] */ (event.data);
    switch (message.command) {

        case 'update':

            // Clear the table
            table.innerHTML = '';
            /** A collection of table row elements to append to the table */
            const tableRows: HTMLTableRowElement[] = [];

            // Create the header row
            const headers = message.data.shift();
            tableRows.push(createRow(headers, true));

            // Create the data rows
            for (const row of message.data) {
                tableRows.push(createRow(row, false));
            }

            // Append the rows to the table
            table.append(...tableRows);
            break;
    }
});
