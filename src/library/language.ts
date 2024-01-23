// Library
import { LANGUAGE } from "../constants";

// --------
// LANGUAGE
// --------

type SupportedLanguages = typeof LANGUAGE[keyof typeof LANGUAGE];

/** Determines if the language is supported by the extension */
export function isSupported(id: string): boolean {
    const supportedLanguages = Object.values(LANGUAGE) as string[];
    return supportedLanguages.includes(id);
}

/**
 * Determines the delimiter for the document
 * @param document The document to determine the delimiter for
 * @returns The delimiter for the document
 */
export function getDelimiter(id: string): string | undefined {
    switch (id) {
        case 'csv':
            return ',';
        case 'tsv':
            return '\t';
        default:
            return undefined;
    }
}
