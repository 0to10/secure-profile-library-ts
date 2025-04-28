'use strict';

import {describe, expect, test} from '@jest/globals';

import {Data} from '../../src/Account/Data';


describe('Data', (): void => {

    test.each([
        {
            key: 'test',
            value: 'something',
        },
        {
            key: 'test.with.dots',
            value: 1234567890,
        },
        {
            key: 'with spaces',
            value: true,
        },
    ])('.get($key) and .set($key, $value)', ({
        key,
        value
    }): void => {
        const data: Data = new Data();

        data.set(key, value);

        expect(data.get(key)).toStrictEqual(value);
    });

    test.each([
        {
            input: {
                first: 'first',
                second: true,
                third: 12345,
            },
            assertions: {
                'first': 'first',
                'not_there': undefined,
                'second': true,
                'third': 12345,
            },
        },
        {
            input: {
                name: {
                    first: 'John',
                    last: 'Doe',
                },
            },
            assertions: {
                'name.first': 'John',
                'name.last': 'Doe',
                'name.non_existing': undefined,
            },
        },
    ])('.fromObject($input)', ({
        input,
        assertions,
    }): void => {
        const data: Data = Data.fromObject(input);

        for (const [key, expected] of Object.entries(assertions)) {
            expect(data.get(key)).toStrictEqual(expected);
            expect(data.has(key)).toStrictEqual(undefined !== expected);
        }
    });

});
