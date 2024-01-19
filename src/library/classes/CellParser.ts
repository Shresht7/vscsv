// Library
import { _Parser, ParserConstructorOptions } from "./_base";

// -----
// VSCSV
// -----

/**
 * A CSV parser specialized for VS Code
 * 
 * This parser is specialized for VS Code, and will return an array of {@link Cell}s instead of an array of strings.
 * The {@link Cell} object contains information about the cell's position in the CSV file. This is useful for
 * the various VS Code apis.
 * 
 * @see {@link Cell}
 */
export class VSCSV extends _Parser<Cell> {

    /**
     * Instantiates a new {@link VSCSV}
     * @param delimiter The delimiter to use (default: `,`)
     */
    constructor(opts?: Partial<ParserConstructorOptions>) {
        super(opts);
    }

    protected parseLine(line: string, lineNumber: number): Cell[] {
        return line.split(this.delimiter).map((value, columnNumber) => ({
            value,
            line: lineNumber,
            column: columnNumber,
            columnEnd: columnNumber + value.length,
        }));
    }

    protected serializeLine(cells: Cell[]): string {
        return cells.map(cell => cell.value).join(this.delimiter);
    }

}

// ----------------
// TYPE DEFINITIONS
// ----------------

/**
 * A cell in a CSV file. Holds information about the cell
 */
type Cell = {
    /** The value of the cell */
    value: string;
    /** The line number of the cell */
    line: number;
    /** The column number of the cell */
    column: number;
    /** The column number of the cell's end */
    columnEnd: number;
};
