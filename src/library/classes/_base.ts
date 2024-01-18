// -------
// _PARSER
// -------

/** Parses a string into a 2D array using the given delimiter */
export abstract class _Parser<T> {

    /** The 2D array of data */
    private readonly data: T[][] = [];

    /**
     * Instantiates a new {@link _Parser}
     * @param delimiter The delimiter to use (default: `,`)
     */
    constructor(
        protected readonly delimiter: string = ","
    ) { }

    /** The column headers. The first row of the data */
    get headers(): T[] {
        return this.data[0];
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
     */
    public parse(doc: string): T[][] {
        /** A 2D array of the results */
        const results: T[][] = [];

        // Split the document into an array of lines
        const lines = doc.split(/\r?\n/);

        // Iterate over each line and collect the cells
        for (let l = 0; l < lines.length; l++) {
            const cells: T[] = this.parseLine(lines[l], l);
            results.push(cells);
        }

        // Return the results
        return results;
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
    public serialize(data: T[][]): string {
        return data.map(row => this.serializeLine(row)).join("\n");
    }

}
