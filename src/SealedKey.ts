'use strict';

import {Cryptography} from './Cryptography';
import {EncryptionKey} from './EncryptionKey';
import {Unsealable} from './Unsealable';

/**
 * SealedKey
 *
 * @copyright Copyright (c) 2024 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class SealedKey implements Unsealable<EncryptionKey> {

    constructor(
        private readonly data: ArrayBuffer,
        private readonly algorithm: KeyAlgorithm,
        private readonly extractable: boolean,
        private readonly usages: Array<KeyUsage>,
    ) {
    }

    public static async fromEncryptionKey(
        encryptionKey: EncryptionKey,
        publicKey: CryptoKey,
    ): Promise<SealedKey> {
        if ('public' !== publicKey.type) {
            throw new Error('Encryption key must be sealed using a public key.');
        }

        const cryptoKey: CryptoKey = encryptionKey.key;

        return Cryptography.wrapKeyAsymmetrical(cryptoKey, publicKey).then(wrapped => {
            return new SealedKey(wrapped, cryptoKey.algorithm, cryptoKey.extractable, cryptoKey.usages);
        });
    }

    public async unseal(privateKey: CryptoKey): Promise<EncryptionKey> {
        if ('private' !== privateKey.type) {
            throw new Error('Encryption key must be unsealed using a private key.');
        }

        return Cryptography.unwrapKeyAsymmetrical(
            this.data,
            privateKey,
            this.algorithm,
            this.extractable,
            this.usages,
        ).then(unwrapped => {
            return new EncryptionKey(unwrapped);
        });
    }

}
