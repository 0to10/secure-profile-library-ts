'use strict';

import {describe, expect, test} from '@jest/globals';

import {KeyDerivation} from '../../src/Cryptography/KeyDerivation';


describe('KeyDerivation', (): void => {

    test.each([
        {
            password: 'qwerty',
            salt: 'abcdefghijklmnopqrstuvwxyz',
            length: 10,
            expectedKey: 'Mf5HiMWJ/Yodgg==',
        },
        {
            password: 'somethingS3cr3t',
            salt: 'abcdefghijklmnopqrstuvwxyz',
            length: 40,
            expectedKey: 'd3tXcR8VmjGzFYisU2iJJ94cRW+5KGhHL7G7EvMZPb2970Z9mtGYOw==',
        },
        {
            password: 'do-not-forget',
            salt: 'abcdefghijklmnopqrstuvwxyz',
            length: 25,
            expectedKey: '/54vKP4QcPJxwS+FpE2KPXu3q0Tjg6iLiQ==',
        },
    ])('.fromPassword($password, $salt, $length)', async ({password, salt, length, expectedKey}): Promise<void> => {
        const encoder: TextEncoder = new TextEncoder();

        const key: Uint8Array = await KeyDerivation.fromPassword(password, encoder.encode(salt), length);
        const keyEncoded: string = btoa(String.fromCharCode.apply(null, key));

        expect(keyEncoded).toStrictEqual(expectedKey);
    });

});
