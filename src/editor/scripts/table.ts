// Library
import Fuse from 'fuse.js';

//Type Definitions
import type { Cell, Data } from '../../library';

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
    private data: Cell[][] = [];

    /** The headers of the table */
    private headers: Cell[] = [];

    /** Updates the table with the given data */
    update(data: Data<Cell>) {
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
    render(data: Cell[][] = this.data) {
        // Return early if there is no data
        if (data?.length < 1) { return; }

        // Clear the table
        this.clear();

        // Create the header row
        this.element.appendChild(this.createRow(this.headers, 'th'));

        // Create the data rows
        for (const row of data) {
            this.element.appendChild(this.createRow(row, 'td'));
        }
    }

    /** Searches the table for the given query and filter the rows */
    search(query: string) {
        if (!query) { return this.render(); } // Return early if there is no query and render the table as is

        // Setup the fuzzy search
        const lines = this.data.map(row => row.map(cell => cell.value).join(' '));
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
    private createRow(row: Cell[], tagName: 'th' | 'td' = 'td') {
        const tr = document.createElement('tr');
        for (const cell of row) {
            tr.appendChild(this.createCell(cell, tagName));
        }
        return tr;
    }

    /** Creates a table cell */
    private createCell(cell: Cell, tagName: 'th' | 'td' = 'td') {
        const td = document.createElement(tagName);
        td.textContent = cell.value;
        td.style.padding = '0.35rem 0.5rem';
        return td;
    }

}
