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

    /** Clears the table */
    clear() {
        this.element.innerHTML = '';
    }

    /** Updates the table with the given data */
    update(data: string[][]) {
        this.clear();

        // Return early if there is no data
        if (data?.length < 1) { return; }

        // Create the header row
        const headers = data.shift()!;
        this.element.appendChild(this.createRow(headers, 'th'));

        // Create the data rows
        for (const row of data) {
            this.element.appendChild(this.createRow(row, 'td'));
        }
    }
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

}
