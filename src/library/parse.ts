// -----
// PARSE
// -----

/**
 * Parses a document into a 2D array using the given delimiter
 * @param doc The document to parse
 * @param delimiter The delimiter to use (default: `,`)
 * @returns A 2D array of the document
 */
export function parse(doc: string, delimiter: string = ","): string[][] {
    /** The resulting 2D array */
    let result: string[][] = [];

    // Split the document into lines
    const lines = doc.split("\n");

    // Iterate over each line and split it into columns
    for (const line of lines) {
        result.push(line.split(delimiter));
    }

    // Return the result
    return result;
}
