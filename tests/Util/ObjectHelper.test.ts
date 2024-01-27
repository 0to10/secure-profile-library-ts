'use strict';

import {describe, expect, test} from '@jest/globals';

import {ObjectHelper} from '../../src/Util/ObjectHelper';


describe('ObjectHelper', (): void => {

    test.each([
        {
            input: {
                first: true,
                second: 2,
                third: 'bla',
            },
            removeProperties: [
                'first',
            ],
            expected: {
                second: 2,
                third: 'bla',
            },
        },
        {
            input: {
                first: true,
                second: 2,
                third: 'bla',
            },
            removeProperties: [
                'first',
                'second',
                'third',
            ],
            expected: {},
        },
        {
            input: {},
            removeProperties: [
                'non_existing',
            ],
            expected: {},
        },
    ])('.removeProperties($input, $removeProperties, $expected)', ({input, removeProperties, expected}): void => {
        const copy: object = Object.assign({}, input);

        const actual: object = ObjectHelper.removeProperties(input, removeProperties);

        expect(actual).toStrictEqual(expected);
        expect(input).toStrictEqual(copy);
    });

});
