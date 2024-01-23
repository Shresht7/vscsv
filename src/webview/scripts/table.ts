// -----
// TABLE
// -----

export class Table {

    private element: HTMLTableElement;

    constructor(private readonly id: string) {
        this.element = document.getElementById(id) as HTMLTableElement;
    }

    clear() {
        this.element.innerHTML = '';
    }

    addHeaderRow(row: string[]) {
        this.element.appendChild(this.createRow(row, 'th'));
    }

    addDataRow(row: string[]) {
        this.element.appendChild(this.createRow(row, 'td'));
    }

    private createRow(row: string[], tagName: 'th' | 'td' = 'td') {
        const tr = document.createElement('tr');
        for (const cell of row) {
            tr.appendChild(this.createCell(cell, tagName));
        }
        return tr;
    }

    private createCell(cell: string, tagName: 'th' | 'td' = 'td') {
        const td = document.createElement(tagName);
        td.textContent = cell;
        td.style.padding = '0.35rem 0.5rem';
        return td;
    }
}
