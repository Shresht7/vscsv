//@ts-check

// Library
import * as esbuild from 'esbuild';
import * as fs from 'node:fs';
import * as path from 'node:path';

/** Boolean indicating whether the current build is for production. */
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Base configuration options for all builds.
 * @type {import('esbuild').BuildOptions}
*/
const baseOptions = {
    bundle: true,   // Bundle all dependencies into a single file
    minify: isProduction, // Minify in production
    sourcemap: !isProduction, // Generate sourcemaps in development
};

/**
 * Configuration for the extension source code. (to be run in the Node.js context)
 * @type {import('esbuild').BuildOptions}
 */
const extensionOptions = {
    ...baseOptions,
    platform: 'node',
    mainFields: ['module', 'main'],
    format: 'cjs',
    entryPoints: ['./src/extension.ts'],
    outfile: './out/extension.js',
    external: ['vscode'],
};

/**
 * Configuration for the webview source code. (to be run in the web-based context)
 * @type {import('esbuild').BuildOptions}
 */
const webviewOptions = {
    ...baseOptions,
    target: "es2020",
    format: "esm",
    entryPoints: ["./src/webview/scripts/index.ts"],
    outfile: "./out/webview.js",
};

/** Copy the stylesheet to the out directory */
function copyStyles() {
    const stylesPath = path.join("./", "src", "webview", "styles", "style.css");
    const outputPath = path.join("./", "out", "style.css");
    fs.copyFileSync(stylesPath, outputPath);
}

// Build the extension and webview code
try {

    // Get the esbuild contexts
    const extensionContext = await esbuild.context(extensionOptions);
    const webviewContext = await esbuild.context(webviewOptions);

    // build
    await Promise.all([
        extensionContext.rebuild(),
        webviewContext.rebuild(),
    ]);

    // Dispose
    await Promise.all([
        extensionContext.dispose(),
        webviewContext.dispose(),
    ]);

    // Copy Styles
    copyStyles();

    console.log('Build complete!');

} catch (err) {
    process.stderr.write(err.message);
    process.exit(1);
}
