'use strict';

import {describe, expect, test} from '@jest/globals';


import {CryptoVersions} from '../src/CryptoVersions';


describe('CryptoVersions', (): void => {

    test('new', (): void => {
        const first: CryptoVersions = new CryptoVersions();
        expect(first.has(0)).toBeTruthy();
        expect(first.has(1)).toBeFalsy();

        const second: CryptoVersions = new CryptoVersions([]);
        expect(second.has(0)).toBeTruthy();
        expect(second.has(1)).toBeFalsy();

        const third: CryptoVersions = new CryptoVersions([
            {
                number: 1,
                algorithm: {
                    name: 'test',
                    iv_length: 1,
                },
            },
        ]);

        expect(third.has(0)).toBeTruthy();
        expect(third.has(1)).toBeTruthy();
        expect(third.has(2)).toBeFalsy();
    });

    test('new with duplicate version', (): void => {
        expect((): void => {
            new CryptoVersions([
                {
                    number: 0,
                    algorithm: {
                        name: 'duplicate',
                        iv_length: 0,
                    },
                },
            ]);
        }).toThrowError('Duplicate version detected with number 0');
    });

    const testVersions: CryptoVersions = new CryptoVersions([
        // Omitted
    ]);

    test('.get', (): void => {
        expect(testVersions.has(0)).toBeTruthy();

        const version: any = testVersions.get(0);

        expect(version).toMatchObject({
            number: 0,
            algorithm: {
                name: 'AES-GCM',
                iv_length: 96,
            },
        });

        expect(testVersions.get(3456)).toBeUndefined();
    });

});
