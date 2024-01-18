// ----------------
// TYPE DEFINITIONS
// ----------------

/**
 * A 2D array of data.
 * It is a collection of {@link Row}s, which in-turn are collections of {@link Cell}s.
 * @see {@link Row}
 * @see {@link Cell}
 */
type Data = Row[];

/**
 * A collection of {@link Cell}s. A {@link Cell} contains information about the value,
 * and it's position in the document (line and column).
 * @see {@link Cell}
 */
type Row = Cell[];

/**
 * A cell contains information about the value, and it's position in the document (line and column)
 * @see {@link Row}
 */
type Cell = {
    value: string;
    line: number;
    column: number;
    columnEnd: number;
};

// -----
// PARSE
// -----

/** Parses a document into a 2D array using the given delimiter */
export class Parser {

    /** The 2D array of data */
    private readonly data: Data = [];

    /**
     * Instantiates a new {@link Parser}
     * @param doc The string document to parse
     * @param delimiter The delimiter to use (default: `,`)
     */
    constructor(
        doc: string,
        private readonly delimiter: string = ","
    ) {
        this.data = Parser.parse(doc, delimiter);
    }

    /** The column headers */
    get headers(): Cell[] {
        return this.data[0];
    }

    /**
     * Parses a document into a 2D array using the given delimiter
     * @param doc The document to parse
     * @param delimiter The delimiter to use (default: `,`)
     * @returns A 2D array of the document
     */
    public static parse(doc: string, delimiter: string = ","): Data {
        /** A 2D array of the results */
        const results: Row[] = [];

        // Split the document into lines
        const lines = doc.split(/\r?\n/);

        // Iterate over each line and split it into cells
        for (let l = 0; l < lines.length; l++) {

            // Determine the cell values, and their positions
            const line = lines[l];
            const columns = line.split(delimiter);
            const cells: Cell[] = columns.map(value => ({
                value,
                line: l,
                column: line.indexOf(value),
                columnEnd: line.indexOf(value) + value.length
            }));

            // Add the cells to the data
            results.push(cells);
        }

        // Return the results
        return results;
    }

    /**
     * Serializes a 2D array into a document using the given delimiter
     * @param data The 2D array to serialize
     * @param delimiter The delimiter to use (default: `,`)
     * @returns A document
     */
    public static serialize(data: Data, delimiter: string = ","): string {
        return data.map(row =>
            row.map(cell => cell.value).join(delimiter)
        ).join("\n");
    }

}
