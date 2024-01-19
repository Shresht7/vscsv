// Library
import * as assert from 'node:assert';
import { CSV } from '../../library';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as myExtension from '../../extension';

suite('Parser', () => {

    // CSV PARSER
    // ----------

    suite('CSV', () => {

        suite('CSV.parse', () => {

            test('should parse a CSV string with a single cell', () => {
                const input = 'a';
                const expected = [['a']];
                const result = CSV.parse(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should parse a CSV string with multiple columns', () => {
                const input = 'a,b,c';
                const expected = [['a', 'b', 'c']];
                const result = CSV.parse(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should parse a CSV string with multiple rows', () => {
                const input = 'a\nb\nc';
                const expected = [['a'], ['b'], ['c']];
                const result = CSV.parse(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should parse a CSV string to a 2D array', () => {
                const input = 'a,b,c\n1,2,3\nx,y,z';
                const expected = [['a', 'b', 'c'], ['1', '2', '3'], ['x', 'y', 'z']];
                const actual = CSV.parse(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should parse a CSV string with empty columns', () => {
                const input = 'a,b,,c';
                const expected = [['a', 'b', '', 'c']];
                const actual = CSV.parse(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should parse a CSV string with empty lines', () => {
                const input = 'a,b,c\n\n1,2,3';
                const expected = [['a', 'b', 'c'], [''], ['1', '2', '3']];
                const result = CSV.parse(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should parse a CSV string with different number of columns in each row', () => {
                const input = 'a,b,c\nd,e\nf';
                const expected = [['a', 'b', 'c'], ['d', 'e'], ['f']];
                const result = CSV.parse(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should parse a empty CSV string', () => {
                const input = '';
                const expected = [['']];
                const result = CSV.parse(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test.skip('should parse a CSV string with a single cell that has quotes', () => {
                const input = '"a"';
                const expected = [['a']];
                const result = CSV.parse(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test.skip('should parse a CSV string with cells that have quotes', () => {
                const input = '"a","b","c"\n"d","e","f"\n"g","h","i"';
                const expected = [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']];
                const result = CSV.parse(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test.skip('should parse a CSV string with quotes', () => {
                const input = 'a,b,"c,d"';
                const expected = [['a', 'b', 'c,d']];
                const result = CSV.parse(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test.skip('should parse a CSV string with quotes and empty columns', () => {
                const input = 'a,b,"",d';
                const expected = [['a', 'b', '', 'd']];
                const result = CSV.parse(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test.skip('should parse a CSV string with quotes around newlines', () => {
                const input = 'a,b,"c\nd"';
                const expected = [['a', 'b', 'c\nd']];
                const result = CSV.parse(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test.skip('should parse a CSV string with quotes around quotes', () => {
                const input = 'a,b,"""c"""';
                const expected = [['a', 'b', '"c"']];
                const result = CSV.parse(input);
                assert.deepStrictEqual(result, expected);
            });


        });

        // SERIALIZE
        // ---------

        suite('CSV.serialize', () => {

            test('should serialize a 2D array of strings with a single cell', () => {
                const input = [['a']];
                const expected = 'a';
                const result = CSV.serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should serialize a 2D array of strings with multiple columns', () => {
                const input = [['a', 'b', 'c']];
                const expected = 'a,b,c';
                const result = CSV.serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should serialize a 2D array of strings with multiple rows', () => {
                const input = [['a'], ['b'], ['c']];
                const expected = 'a\nb\nc';
                const result = CSV.serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should serialize a 2D array of strings to a CSV string', () => {
                const input = [['a', 'b', 'c'], ['1', '2', '3'], ['x', 'y', 'z']];
                const expected = 'a,b,c\n1,2,3\nx,y,z';
                const actual = CSV.serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should serialize a 2D array of strings with empty columns', () => {
                const input = [['a', 'b', '', 'c']];
                const expected = 'a,b,,c';
                const actual = CSV.serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should serialize a 2D array of strings with empty lines', () => {
                const input = [['a', 'b', 'c'], [''], ['1', '2', '3']];
                const expected = 'a,b,c\n\n1,2,3';
                const result = CSV.serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should serialize a 2D array of strings with different number of columns in each row', () => {
                const input = [['a', 'b', 'c'], ['d', 'e'], ['f']];
                const expected = 'a,b,c\nd,e\nf';
                const result = CSV.serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test.skip('should serialize a 2D array of strings with a single cell that has quotes', () => {
                const input = [['a']];
                const expected = '"a"';
                const result = CSV.serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test.skip('should serialize a 2D array of strings with cells that have quotes', () => {
                const input = [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']];
                const expected = '"a","b","c"\n"d","e","f"\n"g","h","i"';
                const result = CSV.serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test.skip('should serialize a 2D array of strings with quotes', () => {
                const input = [['a', 'b', 'c,d']];
                const expected = 'a,b,"c,d"';
                const result = CSV.serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test.skip('should serialize a 2D array of strings with quotes and empty columns', () => {
                const input = [['a', 'b', '', 'd']];
                const expected = 'a,b,"",d';
                const result = CSV.serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test.skip('should serialize a 2D array of strings with quotes around newlines', () => {
                const input = [['a', 'b', 'c\nd']];
                const expected = 'a,b,"c\nd"';
                const result = CSV.serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test.skip('should serialize a 2D array of strings with quotes around quotes', () => {
                const input = [['a', 'b', '"c"']];
                const expected = 'a,b,"""c"""';
                const result = CSV.serialize(input);
                assert.deepStrictEqual(result, expected);
            });

        });

    });

});

