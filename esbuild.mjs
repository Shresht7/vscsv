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
    entryPoints: ["./src/views/webview/index.ts"],
    outfile: "./out/webview.js",
};

// Build the extension and webview code
const args = process.argv.slice(2);
try {

    // Get the esbuild context
    const context = await esbuild.context({
        ...extensionOptions,
        ...webviewOptions,
    });

    if (args.includes('--watch')) {
        // If the --watch flag is present, watch for changes ...
        await context.watch();
        console.log('Watching for changes...');
    } else {
        // ... otherwise, just build once
        await context.rebuild();
        console.log('Build finished');
    }

    // Dispose of the context to free up resources
    await context.dispose();

} catch (err) {
    process.stderr.write(err.message);
    process.exit(1);
}
