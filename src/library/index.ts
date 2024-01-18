// Library
import { parse } from "./parse";

// ----------
// CSV PARSER
// ----------

export const CSV = {
    parse: (doc: string): string[][] => parse(doc, ",")
};
