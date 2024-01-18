// Library
import { _Parser } from './_base';

// ------
// PARSER
// ------

/** The most basic implementation of the {@link _Parser} class */
export class Parser extends _Parser<string> {

    /**
     * Instantiates a new {@link Parser}
     * @param delimiter The delimiter to use (default: `,`)
     */
    constructor(delimiter: string = ",") {
        super(delimiter);
    }

    protected parseLine(line: string): string[] {
        return line.split(this.delimiter);
    }

    protected serializeLine(cells: string[]): string {
        return cells.join(this.delimiter);
    }

}
