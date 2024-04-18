'use strict';

import {describe, expect, test} from '@jest/globals';

import {Configuration} from '../src';
import {KeyPairFactory} from '../src/KeyPairFactory';
import {EncryptionKey} from '../src/EncryptionKey';

import {SealedKey} from '../src/SealedKey';


describe('SealedKey', (): void => {

    const keyPairFactory: KeyPairFactory = new KeyPairFactory(Configuration.encryptionKeyGenAlgorithm);

    test('.fromEncryptionKey()', async (): Promise<void> => {
        const encryptionKey: EncryptionKey = await EncryptionKey.generate();
        const keyPair: CryptoKeyPair = await keyPairFactory.generateEncryption(false);

        const sealedKey: SealedKey = await SealedKey.fromEncryptionKey(encryptionKey, keyPair.publicKey);

        expect(sealedKey).toBeInstanceOf(SealedKey);
    });

    test('.fromEncryptionKey() with non-public key', async (): Promise<void> => {
        const encryptionKey: EncryptionKey = await EncryptionKey.generate();
        const keyPair: CryptoKeyPair = await keyPairFactory.generateEncryption(false);

        await expect(async (): Promise<void> => {
            await SealedKey.fromEncryptionKey(encryptionKey, keyPair.privateKey);
        }).rejects.toThrowError('Encryption key must be sealed using a public key.');
    });

    test('.unseal()', async (): Promise<void> => {
        const encryptionKey: EncryptionKey = await EncryptionKey.generate();
        const keyPair: CryptoKeyPair = await keyPairFactory.generateEncryption(false);

        const sealed: SealedKey = await encryptionKey.seal(keyPair.publicKey);

        const unsealed: EncryptionKey = await sealed.unseal(keyPair.privateKey);

        expect(unsealed).toStrictEqual(encryptionKey);
    });

    test('.unseal() with non-private key', async (): Promise<void> => {
        const encryptionKey: EncryptionKey = await EncryptionKey.generate();
        const keyPair: CryptoKeyPair = await keyPairFactory.generateEncryption(false);

        const sealed: SealedKey = await encryptionKey.seal(keyPair.publicKey);

        await expect(async (): Promise<void> => {
            await sealed.unseal(keyPair.publicKey)
        }).rejects.toThrowError('Encryption key must be unsealed using a private key.');
    });

});
