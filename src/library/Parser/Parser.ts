// -------
// _PARSER
// -------

/** A cell can be a string or an interface that implements the `toString` method */
type ViableCellTypes = string | { toString: () => string };

/** Parses a string into a 2D array using the given delimiter */
export abstract class _Parser<Cell extends ViableCellTypes = string> {

    /** The delimiter to use */
    protected delimiter: string;

    /**
     * Instantiates a new {@link _Parser}
     * @param opts The options for the {@link _Parser} class
     */
    constructor(opts?: {
        /** The delimiter to use (default: `,`) */
        delimiter?: string,
    }) {
        this.delimiter = opts?.delimiter ?? ",";
    }

    public setDelimiter(delimiter: string) {
        this.delimiter = delimiter;
    }

    /**
    * Parses a string value into a cell
    * @param value The value to parse into a cell
    * @param columnNumber The column number of the cell being parsed
    * @param lineNumber The line number of the cell being parsed
    */
    protected abstract parseCell(value: string, columnNumber?: number, lineNumber?: number): Cell;

    /**
     * Parses a line into an array of cells
     * @param line The line to parse into an array of cells
     * @param lineNumber The line number of the line being parsed
     * @see {@link ViableCellTypes}
     */
    protected parseLine(line: string, lineNumber?: number): Cell[] {
        const cells: Cell[] = [];
        let currentCell = "";
        let columnStart = 0;
        let isQuoted = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                // If we encounter a quote...
                if (isQuoted && line[i + 1] === '"') {
                    // ...and we're in a quoted field and the next character is also a quote,
                    // it's an escaped quote (according to RFC 4180).
                    currentCell += '"';
                    i++; // Skip the next quote as it's part of the escape sequence.
                } else {
                    // Otherwise, it's a regular quote, so we toggle the `isQuoted` flag.
                    isQuoted = !isQuoted;
                }
            } else if (char === this.delimiter && !isQuoted) {
                // If we encounter a delimiter and we're not in a quoted field,
                // we've reached the end of a cell.
                cells.push(this.parseCell(currentCell, columnStart, lineNumber));
                currentCell = "";
                columnStart = i + 1;
            } else {
                // Otherwise, we just append the character to the current cell.
                currentCell += char;
            }
        }

        // Add the last cell to the row.
        cells.push(this.parseCell(currentCell, columnStart, lineNumber));
        return cells;
    }

    /**
     * Parses the document into a 2D array of {@link ViableCellTypes | cells}
     * @param doc The document to parse
     */
    public parse(doc: string): Data<Cell> {
        const data = new Data<Cell>();

        // Split the document into an array of lines
        const lines = doc.trim().split(/\r?\n/);

        // Iterate over each line and collect the cells
        for (let l = 0; l < lines.length; l++) {
            const cells: Cell[] = this.parseLine(lines[l], l);
            data.push(cells);
        }

        return data;
    }

    /**
     * Serializes a row of cells into a string
     * @param row The array of {@link ViableCellTypes | cells} to serialize into a string
     */
    protected serializeLine(row: Cell[]): string {
        return row.map((c) => {
            const cell = c.toString();
            // According to RFC 4180, a cell must be quoted if it contains a delimiter, a newline, or a double-quote.
            const needsQuoting = cell.includes(this.delimiter) || cell.includes('"') || cell.includes('\n');

            if (needsQuoting) {
                // To escape a double-quote, it must be doubled.
                const escapedCell = cell.replace(/"/g, '""');
                return `"${escapedCell}"`;
            }

            return cell;
        }).join(this.delimiter);
    }

    /**
     * Serializes the data into a string
     * @param data The data to serialize to a string. Must be a 2-Dimensional array of {@link ViableCellTypes}s
     */
    public serialize(data: Cell[][]): string {
        return data.map(row => this.serializeLine(row)).join("\n");
    }

}



// ------
// PARSER
// ------

/**
 * The most basic implementation of the {@link _Parser} class
 * 
 * The {@link ViableCellTypes | cell}s are simply strings.
 */
export class Parser extends _Parser<string> {

    protected parseCell(value: string): string {
        return value;
    }

}

export class Data<Cell extends ViableCellTypes = string> extends Array<Cell[]> {

    constructor() {
        super();
    }

    // GETTERS & SETTERS
    // -----------------

    /** The column headers. The first row of the data */
    get headers(): Cell[] {
        return this[0];
    }

    // METHODS
    // -------

    /** Get the row at the given index */
    getRow(index: number): Cell[] | undefined {
        return this.at(index);
    }

    /** Get the column at the given index */
    getColumn(index: number): (Cell | undefined)[] {
        return this.map(row => row.at(index));
    }

    /**
     * Gets the value of a cell
     * @param row The row index of the cell
     * @param column The column index of the cell
     * @returns The value of the cell
     */
    getCell(row: number, column: number): Cell | undefined {
        return this.at(row)?.at(column);
    }

    /**
     * Perform a callback on each cell in the data
     * @param callback The callback to call for each cell
     */
    forEachCell(callback: (cell: Cell, row: number, column: number) => void): void {
        this.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                callback(cell, rowIndex, columnIndex);
            });
        });
    }

    /** @returns the header corresponding to the given column number */
    getHeader(column: number): Cell | undefined {
        return this.headers.at(column);
    }

}
