'use strict';

import {describe, expect, test} from '@jest/globals';

import {CryptoKey} from '@peculiar/webcrypto';

import {KeyPairFactory} from '../src/KeyPairFactory';


describe('KeyPairFactory', (): void => {

    test('new fails with insecure modulus length', (): void => {
        expect((): void => {
            new KeyPairFactory(2047);
        }).toThrowError('Modulus length below 2048 bits is considered unsafe');
    });

    const factory: KeyPairFactory = new KeyPairFactory(4096);

    test('generateEncryption()', async (): Promise<void> => {
        const keyPair: CryptoKeyPair = await factory.generateEncryption(false);

        const publicKey: CryptoKey = keyPair.publicKey;
        expect(publicKey).toBeInstanceOf(CryptoKey);
        expect(publicKey.extractable).toStrictEqual(true);
        expect(publicKey.type).toStrictEqual('public');
        expect(publicKey.usages).toStrictEqual(['encrypt']);

        const privateKey: CryptoKey = keyPair.privateKey;
        expect(privateKey).toBeInstanceOf(CryptoKey);
        expect(privateKey.extractable).toStrictEqual(false);
        expect(privateKey.type).toStrictEqual('private');
        expect(privateKey.usages).toStrictEqual(['decrypt']);
    });

});