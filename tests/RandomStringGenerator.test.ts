'use strict';

import {describe, expect, test} from '@jest/globals';

import {RandomStringGenerator} from '../src/RandomStringGenerator';


describe('RandomStringGenerator', (): void => {

    const generator: RandomStringGenerator = new RandomStringGenerator([
        {
            label: 'A-D',
            value: 'ABCD',
        },
        {
            label: 'E-H',
            value: 'EFGH',
        },
        {
            label: 'I-L',
            value: 'IJKL',
        },
        {
            label: '0-3',
            value: '0123',
        },
        {
            label: 'Symbols',
            value: '[{}/]',
        },
    ]);

    test.each([
        {length: 30},
        {length: 40},
        {length: 25},
    ])('.generate($length)', ({length}): void => {
        const actual: string = generator.generate(length);

        expect(typeof actual).toStrictEqual('string');
        expect(actual.length).toStrictEqual(length);
    });

});
