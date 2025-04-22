'use strict';

import {Cryptography} from './Cryptography';
import {EncryptionResult} from './EncryptionResult.type';
import {SealedKey} from './SealedKey';
import {Sealable} from './Sealable';

const textEncoder: TextEncoder = new TextEncoder();

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

    public async encrypt(data: string | ArrayBuffer): Promise<EncryptionResult> {
        const salt: Uint8Array = Cryptography.randomBytes(16);

        if ('string' === typeof data) {
            data = textEncoder.encode(data);
        }

        return {
            iv: salt.buffer,
            data: await Cryptography.encryptSymmetrical(this.key, salt, data),
        };
    }

    public async decrypt(salt: ArrayBuffer, data: ArrayBuffer): Promise<ArrayBuffer> {
        return Cryptography.decryptSymmetrical(this.key, salt, data);
    }

    public async seal(publicKey: CryptoKey): Promise<SealedKey> {
        return SealedKey.fromEncryptionKey(this, publicKey);
    }

}
