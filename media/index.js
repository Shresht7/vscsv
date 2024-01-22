const table = /** @type HTMLTableElement */ (document.getElementById('table'));

/**
 * Creates a table row
 * @param {string[]} row The row
 * @param {boolean} isHeader The row is a header row
 */
function createRow(row, isHeader) {
    // Create a table row element
    const tr = document.createElement('tr');

    // Determine the tag name to use
    const tagName = isHeader ? 'th' : 'td';

    // Loop over the cells in the row...
    for (const cell of row) {
        // ... and create a table cell element for each
        const td = document.createElement(tagName);
        td.textContent = cell;
        tr.appendChild(td);
    }

    // Add the row to the table
    table.appendChild(tr);
}

window.addEventListener('message', (event) => {
    const payload = /** @type any[] */ (event.data.data);
    table.innerHTML = '';
    const headers = payload.shift();
    createRow(headers, true);
    for (const row of payload) {
        createRow(row, false);
    }
});
