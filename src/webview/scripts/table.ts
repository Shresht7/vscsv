// Library
const Fuse = require('fuse.js');

// -----
// TABLE
// -----

export class Table {

    /** The HTML table element */
    private element: HTMLTableElement;

    /** Creates a new table */
    constructor(private readonly id: string) {
        this.element = document.getElementById(id) as HTMLTableElement;
    }

    //#region Data Handling

    /** The data being represented */
    private data: string[][] = [];

    /** The headers of the table */
    private headers: string[] = [];

    /** Updates the table with the given data */
    update(data: string[][]) {
        // Return early if there is no data
        if (data?.length < 1) { return; }
        this.data = data; // Update the data
        this.headers = data[0]; // Update the headers
        this.render(); // Render the table with the new data
    }

    //#endregion

    //#region Rendering Logic

    /** Clears the table */
    clear() {
        this.element.innerHTML = '';
    }

    /** Renders the table */
    render(data: string[][] = this.data) {
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

    /** Searches the table for the given query */
    search(query: string) {
        if (!query) { return this.render(); } // Return early if there is no query

        // Setup the fuzzy search
        const lines = this.data.map(x => x.join(' '));
        const fuse = new Fuse(lines, { threshold: 0.3 });

        // Search the data and sort by score (descending)
        const results = fuse.search(query) as { item: string, refIndex: number, score: number }[];
        const filteredData = results
            .sort((a, b) => b.score - a.score)
            .map(x => this.data[x.refIndex]);

        // Render the filtered data
        this.render(filteredData);
    }

    //#endregion Rendering Logic

    //#region Helper Functions

    /** Creates a table row */
    private createRow(row: string[], tagName: 'th' | 'td' = 'td') {
        const tr = document.createElement('tr');
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

    //#endregion Helper Functions

}
