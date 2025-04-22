'use strict';

import {describe, expect, test} from '@jest/globals';

import {Configuration} from '../src';
import {KeyPairFactory} from '../src/KeyPairFactory';
import {SealedKey} from '../src/SealedKey';

import {EncryptionKey} from '../src/EncryptionKey';
import {EncryptionResult} from '../src/EncryptionResult.type';


describe('EncryptionKey', (): void => {

    const keyPairFactory: KeyPairFactory = new KeyPairFactory(
        Configuration.encryptionKeyGenAlgorithm,
    );

    const textEncoder: TextEncoder = new TextEncoder();

    test('.generate()', async (): Promise<void> => {
        const encryptionKey: EncryptionKey = await EncryptionKey.generate();

        expect(encryptionKey).toBeInstanceOf(EncryptionKey);
    });

    test.each([
        {
            input: 'This is the string we will encrypt and decrypt!',
        },
    ])('.encrypt($input) and .decrypt()', async ({
        input,
    }): Promise<void> => {
        const encodedInput: ArrayBuffer = textEncoder.encode(input).buffer;

        const encryptionKey: EncryptionKey = await EncryptionKey.generate();

        const first: EncryptionResult = await encryptionKey.encrypt(input);

        expect(
            await encryptionKey.decrypt(first.iv, first.data)
        ).toStrictEqual(encodedInput);

        const second: EncryptionResult = await encryptionKey.encrypt(encodedInput);

        expect(
            await encryptionKey.decrypt(second.iv, second.data)
        ).toStrictEqual(encodedInput);
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
