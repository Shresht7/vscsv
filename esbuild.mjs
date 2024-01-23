//@ts-check

// Library
import * as esbuild from 'esbuild';

/** Boolean indicating whether the current build is for production. */
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Base configuration options for all builds.
 * @type {import('esbuild').BuildOptions}
*/
const baseOptions = {
    bundle: true,
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
    entryPoints: ["./src/webviews/scripts/index.ts"],
    outfile: "./out/webview.js",
};

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

    console.log('Build complete!');

} catch (err) {
    process.stderr.write(err.message);
    process.exit(1);
}
