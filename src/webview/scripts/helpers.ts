/**
 * Creates a table row element and adds it to the table
 * @param row The row to add to the table
 * @param isHeader The row is a header row
 */
export function createRow(row: string[], isHeader: boolean): HTMLTableRowElement {
    // Create a table row element
    const tr = document.createElement('tr');

    // Determine the tag name to use
    const tagName = isHeader ? 'th' : 'td';

    // Loop over the cells in the row...
    for (const cell of row) {
        // ... and create a table cell element for each
        const td = document.createElement(tagName);
        td.textContent = cell;
        td.style.padding = '0.35rem 0.5rem';
        tr.appendChild(td);
    }

    return tr;
}
