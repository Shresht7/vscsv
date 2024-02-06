// Library
import type { Cell, Data } from "../library";

// ----------------
// TYPE DEFINITIONS
// ----------------

/** A message sent from the extension to the webview */
export type VSCodeMessage = {
    command: 'update',
    data: Data<Cell>
};

/** A message sent from the webview to the extension */
export type WebviewMessage = {
    command: 'error',
    data: string
} | {
    command: 'ready'
    data: boolean
};
