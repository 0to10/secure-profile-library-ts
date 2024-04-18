'use strict';

import {describe, expect, test} from '@jest/globals';

import {Configuration} from '../src';
import {KeyPairFactory} from '../src/KeyPairFactory';
import {SealedKey} from '../src/SealedKey';

import {EncryptionKey} from '../src/EncryptionKey';


describe('EncryptionKey', (): void => {

    const keyPairFactory: KeyPairFactory = new KeyPairFactory(Configuration.encryptionKeyGenAlgorithm);

    test('.generate()', async (): Promise<void> => {
        const encryptionKey: EncryptionKey = await EncryptionKey.generate();

        expect(encryptionKey).toBeInstanceOf(EncryptionKey);
    });

    test('.seal()', async (): Promise<void> => {
        const encryptionKey: EncryptionKey = await EncryptionKey.generate();

        const keyPair: CryptoKeyPair = await keyPairFactory.generateEncryption(false);

        const sealed: SealedKey = await encryptionKey.seal(keyPair.publicKey);

        expect(sealed).toBeInstanceOf(SealedKey);

        const unsealed: EncryptionKey = await sealed.unseal(keyPair.privateKey);

        expect(unsealed).toStrictEqual(encryptionKey);
    });

});
