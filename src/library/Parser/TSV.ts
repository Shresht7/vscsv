// Library
import { Parser } from './Parser';

// ----------
// TSV PARSER
// ----------

/** A TSV parser and serializer */
export class TSV {

    /** The static instantiation of the x@xxxx Parser} */
    private static _parser: Parser = new Parser({ delimiter: '\t' });

    private constructor() { }

    /**
     * Parses a TSV document into a 2D array of strings
     * @param doc The TSV document to parse
     * @returns A 2D array of strings
     */
    public static parse(doc: string): string[][] {
        return this._parser.parse(doc);
    }

    /**
     * Serializes a 2D array of strings into a TSV document
     * @param data The 2D array of strings to serialize
     * @returns A TSV document
     */
    public static serialize(data: string[][]): string {
        return this._parser.serialize(data);
    }
}
