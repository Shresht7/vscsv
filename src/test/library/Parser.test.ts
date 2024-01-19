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
                const result = new Parser().parse(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should parse a CSV string with multiple columns', () => {
                const input = 'a,b,c';
                const expected = [['a', 'b', 'c']];
                const result = new Parser().parse(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should parse a CSV string with multiple rows', () => {
                const input = 'a\nb\nc';
                const expected = [['a'], ['b'], ['c']];
                const result = new Parser().parse(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should parse a CSV string to a 2D array', () => {
                const input = 'a,b,c\n1,2,3\nx,y,z';
                const expected = [['a', 'b', 'c'], ['1', '2', '3'], ['x', 'y', 'z']];
                const actual = new Parser().parse(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should parse a string with a different delimiter', () => {
                const input = 'a;b;c\n1;2;3\nx;y;z';
                const expected = [['a', 'b', 'c'], ['1', '2', '3'], ['x', 'y', 'z']];
                const actual = new Parser(';').parse(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should parse a CSV string with empty columns', () => {
                const input = 'a,b,,c';
                const expected = [['a', 'b', '', 'c']];
                const actual = new Parser().parse(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should parse a CSV string with empty lines', () => {
                const input = 'a,b,c\n\n1,2,3';
                const expected = [['a', 'b', 'c'], [''], ['1', '2', '3']];
                const result = new Parser().parse(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should parse a CSV string with different number of columns in each row', () => {
                const input = 'a,b,c\nd,e\nf';
                const expected = [['a', 'b', 'c'], ['d', 'e'], ['f']];
                const result = new Parser().parse(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should parse a empty CSV string', () => {
                const input = '';
                const expected = [['']];
                const result = new Parser().parse(input);
                assert.deepStrictEqual(result, expected);
            });

        });

        suite('Serialize', () => {

            test('should serialize a 2D array of strings with a single cell', () => {
                const input = [['a']];
                const expected = 'a';
                const result = new Parser().serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should serialize a 2D array of strings with multiple columns', () => {
                const input = [['a', 'b', 'c']];
                const expected = 'a,b,c';
                const result = new Parser().serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should serialize a 2D array of strings with multiple rows', () => {
                const input = [['a'], ['b'], ['c']];
                const expected = 'a\nb\nc';
                const result = new Parser().serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should serialize a 2D array of strings to a CSV string', () => {
                const input = [['a', 'b', 'c'], ['1', '2', '3'], ['x', 'y', 'z']];
                const expected = 'a,b,c\n1,2,3\nx,y,z';
                const actual = new Parser().serialize(input);
                assert.deepStrictEqual(actual, expected);
            });

            test('should serialize a string with a different delimiter', () => {
                const input = 'a;b;c\n1;2;3\nx;y;z';
                const expected = [['a', 'b', 'c'], ['1', '2', '3'], ['x', 'y', 'z']];
                const actual = new Parser(';').parse(input);
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
                const result = new Parser().serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            test('should serialize a 2D array of strings with different number of columns in each row', () => {
                const input = [['a', 'b', 'c'], ['d', 'e'], ['f']];
                const expected = 'a,b,c\nd,e\nf';
                const result = new Parser().serialize(input);
                assert.deepStrictEqual(result, expected);
            });

        });

    });

    // ADVANCED PARSER
    // ---------------

    suite.skip('Parser', () => {

        suite('Parse', () => {

            // TODO
            test('should parse a CSV string with a single cell that has quotes', () => {
                const input = '"a"';
                const expected = [['a']];
                const result = new Parser().parse(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test('should parse a CSV string with cells that have quotes', () => {
                const input = '"a","b","c"\n"d","e","f"\n"g","h","i"';
                const expected = [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']];
                const result = new Parser().parse(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test('should parse a CSV string with quotes', () => {
                const input = 'a,b,"c,d"';
                const expected = [['a', 'b', 'c,d']];
                const result = new Parser().parse(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test('should parse a CSV string with quotes and empty columns', () => {
                const input = 'a,b,"",d';
                const expected = [['a', 'b', '', 'd']];
                const result = new Parser().parse(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test('should parse a CSV string with quotes around newlines', () => {
                const input = 'a,b,"c\nd"';
                const expected = [['a', 'b', 'c\nd']];
                const result = new Parser().parse(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test('should parse a CSV string with quotes around quotes', () => {
                const input = 'a,b,"""c"""';
                const expected = [['a', 'b', '"c"']];
                const result = new Parser().parse(input);
                assert.deepStrictEqual(result, expected);
            });


        });

        suite('Serialize', () => {

            // TODO
            test('should serialize a 2D array of strings with a single cell that has quotes', () => {
                const input = [['a']];
                const expected = '"a"';
                const result = new Parser().serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test('should serialize a 2D array of strings with cells that have quotes', () => {
                const input = [['a', 'b', 'c'], ['d', 'e', 'f'], ['g', 'h', 'i']];
                const expected = '"a","b","c"\n"d","e","f"\n"g","h","i"';
                const result = new Parser().serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test('should serialize a 2D array of strings with quotes', () => {
                const input = [['a', 'b', 'c,d']];
                const expected = 'a,b,"c,d"';
                const result = new Parser().serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test('should serialize a 2D array of strings with quotes and empty columns', () => {
                const input = [['a', 'b', '', 'd']];
                const expected = 'a,b,"",d';
                const result = new Parser().serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test('should serialize a 2D array of strings with quotes around newlines', () => {
                const input = [['a', 'b', 'c\nd']];
                const expected = 'a,b,"c\nd"';
                const result = new Parser().serialize(input);
                assert.deepStrictEqual(result, expected);
            });

            // TODO
            test('should serialize a 2D array of strings with quotes around quotes', () => {
                const input = [['a', 'b', '"c"']];
                const expected = 'a,b,"""c"""';
                const result = new Parser().serialize(input);
                assert.deepStrictEqual(result, expected);
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

