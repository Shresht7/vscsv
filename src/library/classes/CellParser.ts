// Library
import { Parser } from ".";
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
export class VSCSV extends Parser<Cell> {

    /**
     * Instantiates a new {@link VSCSV}
     * @param delimiter The delimiter to use (default: `,`)
     */
    constructor(opts?: Partial<ParserConstructorOptions>) {
        super(opts);
    }

    protected parseCell(value: string, columnNumber: number, lineNumber: number): Cell {
        return {
            value,
            line: lineNumber,
            column: columnNumber,
            columnEnd: columnNumber + value.length,
            toString: () => value
        };
    }

    protected parseLine(line: string, lineNumber: number): Cell[] {
        return line
            .split(this.delimiter)
            .map((value, columnNumber) => {
                return this.parseCell(value, columnNumber, lineNumber);
            });
    }

    protected serializeCell(cell: Cell): string {
        return cell.value;
    }

    protected serializeLine(cells: Cell[]): string {
        return cells
            .map(this.serializeCell)
            .join(this.delimiter);
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
    toString: () => string;
};
