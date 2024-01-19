// -------
// SHUFFLE
// -------

/**
 * Shuffle an array in place using the Fisher-Yates algorithm
 * @param array The array to shuffle
 * @returns The shuffled array
 */
export function shuffle<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i
        const j = Math.floor(Math.random() * (i + 1));
        // Swap array[i] with array[j]
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
