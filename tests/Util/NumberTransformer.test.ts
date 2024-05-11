'use strict';

import {describe, expect, test} from '@jest/globals';

import {NumberTransformer} from '../../src/Util/NumberTransformer';


describe('NumberTransformer', (): void => {

    test.each([
        {
            input: 0,
            expected: [0],
        },
        {
            input: 5,
            expected: [5],
        },
        {
            input: 257,
            expected: [1, 1],
        },
        {
            input: 99,
            expected: [99],
        },
        {
            input: 23489,
            expected: [193, 91],
        },
    ])('.toUint8Array($input, $expected)', ({input, expected}): void => {
        const actual: Uint8Array = NumberTransformer.toUint8Array(input);

        expect(actual).toStrictEqual(new Uint8Array(expected));
        expect(NumberTransformer.fromUint8Array(actual)).toStrictEqual(input);
    });

});
