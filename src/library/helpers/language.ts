// Library
import { LANGUAGE } from "../extension";

// --------
// LANGUAGE
// --------

/** The language (IDs) supported by the extension */
export type SupportedLanguage = typeof LANGUAGE[keyof typeof LANGUAGE];

/** Determines if the language is supported by the extension */
export function isSupported(id: string): id is SupportedLanguage {
    return Object.values(LANGUAGE).includes(id as SupportedLanguage);
}

/** Maps the language (IDs) to their corresponding delimiters */
export const delimiters: Record<SupportedLanguage, string> = {
    csv: ',',
    tsv: '\t',
};
