// ----------------
// TYPE DEFINITIONS
// ----------------

/** A message sent from the extension to the webview */
export type VSCodeMessage = {
    command: 'update',
    data: string[][]
};

/** A message sent from the webview to the extension */
export type WebviewMessage = {
    command: 'error',
    data: string
} | {
    command: 'ready'
    data: boolean
};
