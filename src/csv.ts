// ----------
// CSV PARSER
// ----------

/**
 * Parses a csv document into a 2D array
 * @param doc The csv document to parse
 * @returns A 2D array of the csv document
 */
export function parseCsv(doc: string): string[][] {
    /** The resulting 2D array */
    let result: string[][] = [];

    // Split the document into lines
    const lines = doc.split("\n");

    // Iterate over each line and split it into columns
    for (const line of lines) {
        result.push(line.split(","));
    }

    // Return the result
    return result;
}
