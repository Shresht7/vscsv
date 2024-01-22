// ---------
// GET NONCE
// ---------

/**
 * Generates a random string of 32 characters to be used as a nonce for a webview
 * @returns nonce string for webview content security policy
 */
export function generateNonce(): string {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
