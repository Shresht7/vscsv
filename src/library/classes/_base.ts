// -------
// _PARSER
// -------

/** The options for the {@link _Parser} class */
export type ParserConstructorOptions = {
    /** The delimiter to use (default: `,`) */
    delimiter?: string,
    /** The string to parse */
    doc?: string
};

/** Parses a string into a 2D array using the given delimiter */
export abstract class _Parser<T> {

    /** The 2D array of data */
    public data: T[][] = [];

    /** The delimiter to use */
    protected readonly delimiter: string;

    /** The string to parse */
    protected readonly doc: string;

    /**
     * Instantiates a new {@link _Parser}
     * @param opts The options for the {@link _Parser} class
     */
    constructor(opts?: Partial<ParserConstructorOptions>) {
        this.delimiter = opts?.delimiter ?? ",";
        this.doc = opts?.doc ?? "";
        this.parse();
    }

    /** The column headers. The first row of the data */
    get headers(): T[] {
        return this.data[0];
    }

    /** Get the row at the given index */
    getRow(index: number): T[] | undefined {
        return this.data.at(index);
    }

    /** Get the column at the given index */
    getColumn(index: number): (T | undefined)[] {
        return this.data.map(row => row.at(index));
    }

    /**
     * Gets the value of a cell
     * @param row The row index of the cell
     * @param column The column index of the cell
     * @returns The value of the cell
     */
    getCell(row: number, column: number): T | undefined {
        return this.data.at(row)?.at(column);
    }

    /**
     * Parses a line into an array of cells
     * @param line The line to parse into an array of cells
     * @param lineNumber The line number of the line being parsed
     */
    protected abstract parseLine(line: string, lineNumber?: number): T[];

    /**
     * Parses a string into a 2D array using the given delimiter
     * @param doc The string to parse
     * @returns This {@link _Parser} instance
     */
    public parse(doc: string = this.doc): this {
        // Clear the data
        this.data = [];

        // Split the document into an array of lines
        const lines = doc.split(/\r?\n/);

        // Iterate over each line and collect the cells
        for (let l = 0; l < lines.length; l++) {
            const cells: T[] = this.parseLine(lines[l], l);
            this.data.push(cells);
        }

        // Return this instance
        return this;
    }

    /**
     * Serializes an array of cells into a string
     * @param cells The array of cells to serialize into a string
     */
    protected abstract serializeLine(cells: T[]): string;

    /**
     * Serializes a 2D array into a string using the given delimiter
     * @param data The 2D array to serialize
     */
    public serialize(data: T[][] = this.data): string {
        return data.map(row => this.serializeLine(row)).join("\n");
    }

}
