// --------
// SETTINGS
// --------

/** Maps the configuration keys to their default values */
export const Settings = {
    enableSyntaxHighlighting: true,
    enableDocumentSymbols: true,
    enableHoverInformation: true,
    enableDiagnostics: true,
};

export type SettingsKey = keyof typeof Settings;
