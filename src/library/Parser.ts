// -------
// _PARSER
// -------

/** A cell can be a string or an interface that implements the `toString` method */
type ViableCellTypes = string | { toString: () => string };

/** Parses a string into a 2D array using the given delimiter */
export abstract class _Parser<Cell extends ViableCellTypes = string> {

    // PROPERTIES
    // ----------

    /** The 2D array of data */
    public data: Cell[][] = [];

    /** The delimiter to use */
    private delimiter: string;

    /** The string to parse */
    protected readonly doc: string;

    // CONSTRUCTOR
    // -----------

    /**
     * Instantiates a new {@link _Parser}
     * @param opts The options for the {@link _Parser} class
     */
    constructor(opts?: {
        /** The delimiter to use (default: `,`) */
        delimiter?: string,
        /** The string to parse */
        doc?: string
    }) {
        this.delimiter = opts?.delimiter ?? ",";
        this.doc = opts?.doc ?? "";
        this.parse();
    }

    // ABSTRACT METHODS
    // ----------------

    /**
    * Parses a string value into a cell
    * @param value The value to parse into a cell
    * @param columnNumber The column number of the cell being parsed
    * @param lineNumber The line number of the cell being parsed
    */
    protected abstract parseCell(value: string, columnNumber?: number, lineNumber?: number): Cell;

    // GETTERS & SETTERS
    // -----------------

    /** The column headers. The first row of the data */
    get headers(): Cell[] {
        return this.data[0];
    }

    /** Update the delimiter */
    setDelimiter(delimiter: string): this {
        this.delimiter = delimiter;
        return this;
    }

    // METHODS
    // -------

    /** Get the row at the given index */
    getRow(index: number): Cell[] | undefined {
        return this.data.at(index);
    }

    /** Get the column at the given index */
    getColumn(index: number): (Cell | undefined)[] {
        return this.data.map(row => row.at(index));
    }

    /**
     * Gets the value of a cell
     * @param row The row index of the cell
     * @param column The column index of the cell
     * @returns The value of the cell
     */
    getCell(row: number, column: number): Cell | undefined {
        return this.data.at(row)?.at(column);
    }

    /**
     * Perform a callback on each cell in the data
     * @param callback The callback to call for each cell
     */
    forEachCell(callback: (cell: Cell, row: number, column: number) => void): void {
        this.data.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                callback(cell, rowIndex, columnIndex);
            });
        });
    }

    /** @returns the header corresponding to the given column number */
    getHeader(column: number): Cell | undefined {
        return this.headers.at(column);
    }

    /**
     * Parses a line into an array of cells
     * @param line The line to parse into an array of cells
     * @param lineNumber The line number of the line being parsed
     * @see {@link ViableCellTypes}
     */
    protected parseLine(line: string, lineNumber?: number): Cell[] {
        /** The cells of the line */
        const cells: Cell[] = [];

        /** Whether or not the current character is inside of a quoted string */
        let isQuoted = false;

        /** The current cell */
        let cell = "";
        let columnNumber = 0;

        // Iterate through each character in the line ...
        for (let i = 0; i <= line.length; i++) {

            /** The current character */
            const char = line[i];

            if (char === "\\") {
                // If the current character is a backslash, skip it and collect the next character
                cell += line[++i];
                continue;
            }

            if (char === '"') {
                // If the current character is a quote, toggle the `isQuoted` flag
                isQuoted = !isQuoted;
            }

            if ((char === this.delimiter && !isQuoted) || (i === line.length)) {
                // If the current character is the delimiter and the `isQuoted` flag
                // is not set, push the current cell to the `cells` array and reset the `cell` variable
                cells.push(this.parseCell(cell, columnNumber, lineNumber));
                columnNumber = i + 1; // The next column starts after the delimiter
                cell = "";
                continue;
            } else {
                // Otherwise, keep collecting the current cell
                cell += char;
                continue;
            }

        }

        // Return the cells parsed from the line
        return cells;
    }

    /**
     * Parses the document into a 2D array of {@link ViableCellTypes | cells}
     * @param doc The document to parse. (can be omitted if the document was passed in the constructor)
     */
    public parse(doc: string = this.doc): this {
        // Clear the data
        this.data = [];

        // Split the document into an array of lines
        const lines = doc.split(/\r?\n/);

        // Iterate over each line and collect the cells
        for (let l = 0; l < lines.length; l++) {
            const cells: Cell[] = this.parseLine(lines[l], l);
            this.data.push(cells);
        }

        // Return this instance
        return this;
    }

    /**
     * Serializes a row of cells into a string
     * @param row The array of {@link ViableCellTypes | cells} to serialize into a string
     */
    protected serializeLine(row: Cell[]): string {
        return row.map((c) => {
            const cell = c.toString();
            const needsQuoting = cell.includes(this.delimiter) || cell.includes('\\');
            return needsQuoting ? `"${cell}"` : cell;
        }).join(this.delimiter);
    }

    /**
     * Serializes the data into a string
     * @param data The data to serialize to a string. Must be a 2-Dimensional array of {@link ViableCellTypes}s
     */
    public serialize(data: Cell[][] = this.data): string {
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
