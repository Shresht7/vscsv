// ----------------
// TYPE DEFINITIONS
// ----------------

export type VSCodeMessage = {
    command: 'update',
    data: string[][]
};

export type WebviewMessage = {
    command: 'error',
    data: string
} | {
    command: 'ready'
    data: boolean
};
