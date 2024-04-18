'use strict';

import {Cryptography} from './Cryptography';
import {SealedKey} from './SealedKey';
import {Sealable} from './Sealable';

/**
 * EncryptionKey
 *
 * @copyright Copyright (c) 2024 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class EncryptionKey implements Sealable<SealedKey> {

    constructor(
        public readonly key: CryptoKey,
    ) {
    }

    public static async generate(): Promise<EncryptionKey> {
        const key: CryptoKey = await Cryptography.generateSymmetricKey(256);

        return new EncryptionKey(key);
    }

    public async seal(publicKey: CryptoKey): Promise<SealedKey> {
        return SealedKey.fromEncryptionKey(this, publicKey);
    }

}
