// Library
import * as vscode from 'vscode';
import path from 'node:path';
import assert from 'node:assert';
import { Configuration } from '../configuration';
import { EXTENSION_ID } from '../constants';

const extensionPath = path.join(__dirname, '..', '..', 'package.json');

suite('package.json', () => {

    let pkg: any;
    setup(async () => {
        const buf = await vscode.workspace.fs.readFile(vscode.Uri.file(extensionPath));
        const str = new Buffer(buf).toString('utf-8');
        pkg = JSON.parse(str);
    });

    test('should be a valid JSON file', () => {
        assert.ok(pkg);
    });

    // CONFIGURATION
    // -------------

    suite('Configuration', () => {

        test('All configuration options should be defined in package.json', () => {
            const keys = Object.keys(Configuration.Settings).map(k => `${EXTENSION_ID}.${k}`);
            const pkgKeys = Object.keys(pkg.contributes.configuration.properties);
            assert.deepStrictEqual(keys, pkgKeys);
        });

    });

});
