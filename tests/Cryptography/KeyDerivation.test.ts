'use strict';

import {describe, expect, test} from '@jest/globals';

import {KeyDerivation} from '../../src/Cryptography/KeyDerivation';


describe('KeyDerivation', (): void => {

    test.each([
        {
            password: 'qwerty',
            salt: 'abcdefghijklmnopqrstuvwxyz',
            length: 10,
            expectedKey: 'TP5OFcRUPZYfwA==',
        },
        {
            password: 'somethingS3cr3t',
            salt: 'abcdefghijklmnopqrstuvwxyz',
            length: 40,
            expectedKey: 'dUyPfjnjaHw4YNpDJRkY9nALYTaz7lwGTsT+PjBskRWYS5+55eON6g==',
        },
        {
            password: 'do-not-forget',
            salt: 'abcdefghijklmnopqrstuvwxyz',
            length: 25,
            expectedKey: '4oSl9a/1IZe2qRqQzvztysG5WuYMMlo8mA==',
        },
    ])('.fromPassword($password, $salt, $length)', async ({password, salt, length, expectedKey}): Promise<void> => {
        const encoder: TextEncoder = new TextEncoder();

        const key: Uint8Array = await KeyDerivation.fromPassword(password, encoder.encode(salt), length);
        const keyEncoded: string = btoa(String.fromCharCode.apply(null, key));

        expect(keyEncoded).toStrictEqual(expectedKey);
    });

});
