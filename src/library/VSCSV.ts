// Library
import { _Parser } from "./Parser";

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

    protected parseCell(value: string, columnNumber: number, lineNumber: number): Cell {
        return {
            value,
            line: lineNumber,
            column: columnNumber,
            columnEnd: columnNumber + value.length,
            toString: () => value
        };
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
    /** Converts the cell into a string */
    toString: () => string;
};
