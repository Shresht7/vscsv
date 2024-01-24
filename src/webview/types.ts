// ----------------
// TYPE DEFINITIONS
// ----------------

export type SendMessage = {
    command: 'update',
    data: string[][]
};

export type ReceiveMessage = {
    command: 'error',
    data: string
} | {
    command: 'ready'
    data: boolean
};
