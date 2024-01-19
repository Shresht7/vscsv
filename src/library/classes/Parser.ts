// Library
import { _Parser, ParserConstructorOptions } from './_base';

// ------
// PARSER
// ------

/** The most basic implementation of the {@link _Parser} class */
export class Parser extends _Parser<string> {

    /**
     * Instantiates a new {@link Parser}
     * @param opts The options for the {@link Parser} class
     */
    constructor(opts?: Partial<ParserConstructorOptions>) {
        super(opts);
    }

    protected parseLine(line: string): string[] {
        /** The cells of the line */
        const cells: string[] = [];

        /** Whether or not the current character is inside of a quoted string */
        let isQuoted = false;

        /** The current cell */
        let cell = "";

        // Iterate through each character in the line ...
        for (let i = 0; i < line.length; i++) {

            /** The current character */
            const char = line[i];

            if (char === '"') {
                // If the current character is a quote, toggle the `isQuoted` flag
                isQuoted = !isQuoted;
            }

            if (char === this.delimiter && !isQuoted) {
                // If the current character is the delimiter and the `isQuoted` flag
                // is not set, push the current cell to the `cells` array and reset the `cell` variable
                cells.push(cell);
                cell = "";
                continue;
            } else {
                // Otherwise, keep collecting the current cell
                cell += char;
                continue;
            }

        }

        // If there is remnant data in the `cell` variable,
        // push it to the `cells` array as the last cell
        if (cell) {
            cells.push(cell);
        }

        // Return the cells parsed from the line
        return cells;
    }

    protected serializeLine(cells: string[]): string {
        return cells.map((cell) => {
            const hasDelimiter = cell.includes(this.delimiter);
            return hasDelimiter ? `"${cell}"` : cell;
        }).join(this.delimiter);
    }

}
