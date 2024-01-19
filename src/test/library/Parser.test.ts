// Library
import * as assert from 'node:assert';
import { Parser } from '../../library/classes';
import { CSV } from '../../library';

// =======
// PARSERS
// =======

suite('Parser', () => {

    // SIMPLE PARSER
    // -------------

    suite('SimpleParser', () => {

        suite('Parse', () => {

            test('should parse a CSV string with a single cell', () => {
                const input = 'a';
                const expected = [['a']];
                const actual = new Parser().parse(input).data;
                assert.deepStrictEqual(actual, expected);
            });

            test('should parse a CSV string with multiple columns', () => {
                const input = 'a,b,c';
                const expected = [['a', 'b', 'c']];
                const actual = new Parser().parse(input).data;
                assert.deepStrictEqual(actual, expected);
            });

            test('should parse a CSV string with multiple rows', () => {
                const input = 'a\nb\nc';
                const expected = [['a'], ['b'], ['c']];
                const actual = new Parser().parse(input).data;
                assert.deepStrictEqual(actual, expected);
            });

            test('should parse a CSV string to a 2D array', () => {
                const input = 'a,b,c\n1,2,3\nx,y,z';
                const expected = [['a', 'b', 'c'], ['1', '2', '3'], ['x', 'y', 'z']];
                const actual = new Parser().parse(input).data;
                assert.deepStrictEqual(actual, expected);
            });

            test('should parse a string with a different delimiter', () => {
                const input = 'a;b;c\n1;2;3\nx;y;z';
                const expected = [['a', 'b', 'c'], ['1', '2', '3'], ['x', 'y', 'z']];
                const actual = new Parser({ delimiter: ';' }).parse(input).data;
                assert.deepStrictEqual(actual, expected);
            });

            test('should parse a CSV string with empty columns', () => {
                const input = 'a,b,,c';
                const expected = [['a', 'b', '', 'c']];
                const actual = new Parser().parse(input).data;
                assert.deepStrictEqual(actual, expected);
            });

            test('should parse a CSV string with empty lines', () => {
                const input = 'a,b,c\n\n1,2,3';
                const expected = [['a', 'b', 'c'], [], ['1', '2', '3']];
                const actual = new Parser().parse(input).data;
                assert.deepStrictEqual(actual, expected);
            });

            test('should parse a CSV string with different number of columns in each row', () => {
                const input = 'a,b,c\nd,e\nf';
                const expected = [['a', 'b', 'c'], ['d', 'e'], ['f']];
                const actual = new Parser().parse(input).data;
                assert.deepStrictEqual(actual, expected);
            });

            test('should parse a empty CSV string', () => {
                const input = '';
                const expected = [[]];
                const actual = new Parser().parse(input).data;
                assert.deepStrictEqual(actual, expected);
            });

        });

        suite('Serialize', () => {

            test('should serialize a 2D array of strings with a single cell', () => {
                const input = [['a']];
                const expected = 'a';
                const actual = new Parser().serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should serialize a 2D array of strings with multiple columns', () => {
                const input = [['a', 'b', 'c']];
                const expected = 'a,b,c';
                const actual = new Parser().serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should serialize a 2D array of strings with multiple rows', () => {
                const input = [['a'], ['b'], ['c']];
                const expected = 'a\nb\nc';
                const actual = new Parser().serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should serialize a 2D array of strings to a CSV string', () => {
                const input = [['a', 'b', 'c'], ['1', '2', '3'], ['x', 'y', 'z']];
                const expected = 'a,b,c\n1,2,3\nx,y,z';
                const actual = new Parser().serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should serialize a string with a different delimiter', () => {
                const input = [['a', 'b', 'c'], ['1', '2', '3'], ['x', 'y', 'z']];
                const expected = 'a;b;c\n1;2;3\nx;y;z';
                const actual = new Parser({ delimiter: ';' }).serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should serialize a 2D array of strings with empty columns', () => {
                const input = [['a', 'b', '', 'c']];
                const expected = 'a,b,,c';
                const actual = new Parser().serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should serialize a 2D array of strings with empty lines', () => {
                const input = [['a', 'b', 'c'], [''], ['1', '2', '3']];
                const expected = 'a,b,c\n\n1,2,3';
                const actual = new Parser().serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should serialize a 2D array of strings with different number of columns in each row', () => {
                const input = [['a', 'b', 'c'], ['d', 'e'], ['f']];
                const expected = 'a,b,c\nd,e\nf';
                const actual = new Parser().serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

        });

        suite('Helpers', () => {

            test('should be able to get the data', () => {
                const input = 'a,b,c\n1,2,3\nx,y,z';
                const expected = [['a', 'b', 'c'], ['1', '2', '3'], ['x', 'y', 'z']];
                const actual = new Parser().parse(input).data;
                assert.deepStrictEqual(actual, expected);
            });

            test('should be able to get the headers', () => {
                const input = 'a,b,c\n1,2,3\nx,y,z';
                const expected = ['a', 'b', 'c'];
                const actual = new Parser().parse(input).headers;
                assert.deepStrictEqual(actual, expected);
            });

            test('should be able to get a row', () => {
                const input = 'a,b,c\n1,2,3\nx,y,z';
                const expected = ['1', '2', '3'];
                const actual = new Parser().parse(input).getRow(1);
                assert.deepStrictEqual(actual, expected);
            });

            test('should be able to get a row with a negative index', () => {
                const input = 'a,b,c\n1,2,3\nx,y,z';
                const expected = ['x', 'y', 'z'];
                const actual = new Parser().parse(input).getRow(-1);
                assert.deepStrictEqual(actual, expected);
            });

            test('should return undefined row with an out of bounds index', () => {
                const input = 'a,b,c\n1,2,3\nx,y,z';
                const expected = undefined;
                const actual = new Parser().parse(input).getRow(10);
                assert.deepStrictEqual(actual, expected);
            });

            test('should be able to get a column', () => {
                const input = 'a,b,c\n1,2,3\nx,y,z';
                const expected = ['b', '2', 'y'];
                const actual = new Parser().parse(input).getColumn(1);
                assert.deepStrictEqual(actual, expected);
            });

            test('should be able to get a column with a negative index', () => {
                const input = 'a,b,c\n1,2,3\nx,y,z';
                const expected = ['c', '3', 'z'];
                const actual = new Parser().parse(input).getColumn(-1);
                assert.deepStrictEqual(actual, expected);
            });

            test('should return undefined column with an out of bounds index', () => {
                const input = 'a,b,c\n1,2,3\nx,y,z';
                const expected = [undefined, undefined, undefined];
                const actual = new Parser().parse(input).getColumn(10);
                assert.deepStrictEqual(actual, expected);
            });

            test('should be able to get a cell', () => {
                const input = 'a,b,c\n1,2,3\nx,y,z';
                const expected = '2';
                const actual = new Parser().parse(input).getCell(1, 1);
                assert.deepStrictEqual(actual, expected);
            });

            test('should be able to get a cell with negative indices', () => {
                const input = 'a,b,c\n1,2,3\nx,y,z';
                const expected = 'z';
                const actual = new Parser().parse(input).getCell(-1, -1);
                assert.deepStrictEqual(actual, expected);
            });

            test('should return undefined cell with an out of bounds index', () => {
                const input = 'a,b,c\n1,2,3\nx,y,z';
                const expected = undefined;
                const actual = new Parser().parse(input).getCell(10, 10);
                assert.deepStrictEqual(actual, expected);
            });

        });

    });

    // ADVANCED PARSER
    // ---------------

    suite('Parser', () => {

        suite('Parse', () => {

            test('should parse a CSV string with a single cell that has quotes', () => {
                const input = '"a"';
                const expected = [['"a"']];
                const actual = new Parser().parse(input).data;
                assert.deepStrictEqual(actual, expected);
            });

            test('should parse a CSV string with cells that have quotes', () => {
                const input = '"a","b","c"\n"d","e","f"\n"g","h","i"';
                const expected = [['"a"', '"b"', '"c"'], ['"d"', '"e"', '"f"'], ['"g"', '"h"', '"i"']];
                const actual = new Parser().parse(input).data;
                assert.deepStrictEqual(actual, expected);
            });

            test('should parse a CSV string with quotes', () => {
                const input = 'a,b,"c,d"';
                const expected = [['a', 'b', '"c,d"']];
                const actual = new Parser().parse(input).data;
                assert.deepStrictEqual(actual, expected);
            });

            test('should parse a CSV string with quotes and empty columns', () => {
                const input = 'a,b,"",d';
                const expected = [['a', 'b', '""', 'd']];
                const actual = new Parser().parse(input).data;
                assert.deepStrictEqual(actual, expected);
            });

            // TODO
            test.skip('should parse a CSV string with quotes around newlines', () => {
                const input = 'a,b,"c\nd"';
                const expected = [['a', 'b', 'c\nd']];
                const actual = new Parser().parse(input).data;
                assert.deepStrictEqual(actual, expected);
            });

            test('should parse a CSV string with quotes around quotes', () => {
                const input = 'a,b,"""c"""';
                const expected = [['a', 'b', '"""c"""']];
                const actual = new Parser().parse(input).data;
                assert.deepStrictEqual(actual, expected);
            });


        });

        suite('Serialize', () => {

            test('should serialize a 2D array of strings with a single cell that has quotes', () => {
                const input = [['"a"']];
                const expected = '"a"';
                const actual = new Parser().serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should serialize a 2D array of strings with cells that have quotes', () => {
                const input = [['"a"', '"b"', '"c"'], ['"d"', '"e"', '"f"'], ['"g"', '"h"', '"i"']];
                const expected = '"a","b","c"\n"d","e","f"\n"g","h","i"';
                const actual = new Parser().serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should serialize a 2D array of strings with delimiter included', () => {
                const input = [['a', 'b', 'c,d']];
                const expected = 'a,b,"c,d"';
                const actual = new Parser().serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should serialize a 2D array of strings with quotes and empty columns', () => {
                const input = [['a', 'b', '""', 'd']];
                const expected = 'a,b,"",d';
                const actual = new Parser().serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

            // TODO
            test.skip('should serialize a 2D array of strings with quotes around newlines', () => {
                const input = [['a', 'b', 'c\nd']];
                const expected = 'a,b,"c\nd"';
                const actual = new Parser().serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should serialize a 2D array of strings with quotes around quotes', () => {
                const input = [['a', 'b', '"""c"""']];
                const expected = 'a,b,"""c"""';
                const actual = new Parser().serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

        });

    });

    // CSV PARSER
    // ----------

    suite('CSV', () => {

        suite('CSV.parse', () => {

            test('should parse a CSV string to a 2D array', () => {
                const input = 'a,b,c\n1,2,3\nx,y,z';
                const expected = [['a', 'b', 'c'], ['1', '2', '3'], ['x', 'y', 'z']];
                const actual = CSV.parse(input);
                assert.deepStrictEqual(actual, expected);
            });

        });

        suite('CSV.serialize', () => {

            test('should serialize a 2D array of strings to a CSV string', () => {
                const input = [['a', 'b', 'c'], ['1', '2', '3'], ['x', 'y', 'z']];
                const expected = 'a,b,c\n1,2,3\nx,y,z';
                const actual = CSV.serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

        });

    });

});

