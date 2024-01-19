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
        return line.split(this.delimiter);
    }

    protected serializeLine(cells: string[]): string {
        return cells.join(this.delimiter);
    }

}
