// Library
import { Parser } from "./Parser";

// ----------
// CSV PARSER
// ----------

/** A CSV parser and serializer */
export class CSV {

    /** The static instantiation of the {@link Parser} */
    private static _parser: Parser = new Parser({ delimiter: "," });

    private constructor() { }

    /**
     * Parses a CSV document into a 2D array of strings
     * @param doc The CSV document to parse
     * @returns A 2D array of strings
     */
    public static parse(doc: string): string[][] {
        return this._parser.parse(doc).data;
    }

    /**
     * Serializes a 2D array of strings into a CSV document
     * @param data The 2D array of strings to serialize
     * @returns A CSV document
     */
    public static serialize(data: string[][]): string {
        return this._parser.serialize(data);
    }
}
