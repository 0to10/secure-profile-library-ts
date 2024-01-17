'use strict';

import {describe, expect, test} from '@jest/globals';

import {CryptoVersions} from '../src/CryptoVersions';

CryptoVersions.configure([
    {
        number: 1,
        algorithm: {
            name: 'test',
            iv_length: 1,
        },
    },
]);

describe('CryptoVersions', (): void => {

    test('new', (): void => {
        const instance: CryptoVersions = new CryptoVersions();
        expect(instance.has(0)).toBeTruthy();
        expect(instance.has(1)).toBeTruthy();
        expect(instance.has(2)).toBeFalsy();
        expect(instance.has(55)).toBeFalsy();
    });

    test('.configure() with duplicate version', (): void => {
        expect((): void => {
            CryptoVersions.configure([
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

    test('.get', (): void => {
        const instance: CryptoVersions = new CryptoVersions();

        expect(instance.has(0)).toBeTruthy();

        const version: any = instance.get(0);

        expect(version).toMatchObject({
            number: 0,
            algorithm: {
                name: 'AES-GCM',
                iv_length: 96,
            },
        });

        expect(instance.get(3456)).toBeUndefined();
    });

});
