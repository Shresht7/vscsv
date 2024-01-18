// -----
// PARSE
// -----

/** Parses a document into a 2D array using the given delimiter */
export class Parser {

    /** The 2D array of data */
    private readonly data: string[][] = [];

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
    get headers(): string[] {
        return this.data[0];
    }

    /**
     * Parses a document into a 2D array using the given delimiter
     * @param doc The document to parse
     * @param delimiter The delimiter to use (default: `,`)
     * @returns A 2D array of the document
     */
    public static parse(doc: string, delimiter: string = ","): string[][] {
        /** A 2D array of the results */
        const results: string[][] = [];

        // Split the document into lines
        const lines = doc.split(/\r?\n/);

        // Iterate over each line and split it into columns
        for (const line of lines) {
            results.push(line.split(delimiter));
        }

        // Return the results
        return results;
    }

}
