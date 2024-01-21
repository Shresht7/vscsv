// Library
import * as vscode from "vscode";
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

    /**
     * Determines the delimiter to use based on the language ID of the document
     * @param document The document to use to determine the delimiter
     */
    public determineDelimiter(document: vscode.TextDocument) {
        switch (document.languageId) {
            case 'csv':
                this.setDelimiter(',');
                break;
            case 'tsv':
                this.setDelimiter('\t');
                break;
            default:
                // ? Great place to use configuration settings to set custom delimiters
                this.setDelimiter(',');
        }
    }

    protected parseCell(value: string, columnNumber: number, lineNumber: number): Cell {
        return {
            value,
            line: lineNumber,
            column: columnNumber,
            columnEnd: columnNumber + value.length,
            length: value.length,
            range: new vscode.Range(lineNumber, columnNumber, lineNumber, columnNumber + value.length),
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
export type Cell = {
    /** The value of the cell */
    value: string;
    /** The line number of the cell */
    line: number;
    /** The column number of the cell */
    column: number;
    /** The column number of the cell's end */
    columnEnd: number;
    /** The length of the cell */
    length: number;
    /** The range of the cell */
    range: vscode.Range;
    /** Converts the cell into a string */
    toString: () => string;
};
