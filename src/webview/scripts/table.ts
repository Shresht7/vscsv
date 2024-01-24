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

    /** Updates the table with the given data */
    update(data: string[][]) {
        // Return early if there is no data
        if (data?.length < 1) { return; }
        this.data = data; // Update the data
        this.render(); // Render the table with the new data
    }

    //#endregion

    //#region Rendering Logic

    /** Clears the table */
    clear() {
        this.element.innerHTML = '';
    }

    /** Renders the table */
    render() {
        // Return early if there is no data
        if (this.data?.length < 1) { return; }

        // Clear the table
        this.clear();

        // Create the header row
        const headers = this.data.shift()!;
        this.element.appendChild(this.createRow(headers, 'th'));

        // Create the data rows
        for (const row of this.data) {
            this.element.appendChild(this.createRow(row, 'td'));
        }
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
