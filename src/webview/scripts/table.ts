// Library
import Fuse from 'fuse.js';

// -----
// TABLE
// -----

/** The class representing the html table element */
export class Table {

    /** The HTML table element */
    private element: HTMLTableElement;

    /** Creates a new table */
    constructor(private readonly id: string) {
        this.element = document.getElementById(id) as HTMLTableElement;
    }

    // DATA HANDLING
    // -------------

    /** The data to be represented as a table */
    private data: string[][] = [];

    /** The headers of the table */
    private headers: string[] = [];

    /** Updates the table with the given data */
    update(data: string[][]) {
        if (data?.length < 1) { return; }   // Return early if there is no data
        this.headers = data[0];             // Use the first row as the headers
        this.data = data.slice(1);          // Use the rest as the table data
        this.render();                      // Render the html table
    }

    // RENDERING LOGIC
    // ---------------

    /** Clears the table */
    clear() {
        this.element.innerHTML = '';
    }

    /** Renders the html table */
    render(data: string[][] = this.data) {
        // Return early if there is no data
        if (data?.length < 1) { return; }

        // Clear the table
        this.clear();

        // Create the header row
        this.element.appendChild(this.createRow(this.headers, 'th'));

        // Create the data rows
        for (const r in data) {
            this.element.appendChild(this.createRow(data[r], 'td', +r + 1)); // We add 1 because the line numbers are 1-based while the index is 0-based
        }
    }

    /** Searches the table for the given query and filter the rows */
    search(query: string) {
        if (!query) { return this.render(); } // Return early if there is no query and render the table as is

        // Setup the fuzzy search
        const lines = this.data.map(x => x.join(' '));
        const fuse = new Fuse(lines, { threshold: 0.3, includeScore: true });

        // Search the data and sort by score (ascending)
        const results = fuse.search(query);
        const filteredData = results
            // sort the elements of the array in ascending order based on their score property,
            // treating elements with a null, undefined, or missing score property as if their score was 0.
            .sort((a, b) => (a?.score ?? 0) - (b?.score ?? 0))
            .map(x => this.data[x.refIndex]); // Get the data row for the given reference index (sorted by score)

        // Render the filtered data
        this.render(filteredData);
    }

    // HELPER FUNCTIONS
    // ----------------

    /** Creates a table row */
    private createRow(row: string[], tagName: 'th' | 'td' = 'td', lineNumber: number = 0) {
        const tr = document.createElement('tr');

        // Add sticky header property to the header row
        if (tagName === 'th') {
            tr.style.position = 'sticky';
            tr.style.top = '0';
            tr.style.backgroundColor = 'var(--vscode-editor-background)';
        }

        // Add Line Number
        const lineNumberCell = document.createElement(tagName);
        if (lineNumber) {
            lineNumberCell.textContent = lineNumber.toString();
        }
        tr.appendChild(lineNumberCell);

        // Add Cell Data
        for (const cell of row) {
            tr.appendChild(this.createCell(cell, tagName));
        }

        return tr;
    }

    /** Creates a table cell */
    private createCell(cell: string, tagName: 'th' | 'td' = 'td') {
        const td = document.createElement(tagName);
        td.textContent = cell;
        td.style.padding = '0.35rem 0.5rem';
        return td;
    }

}
