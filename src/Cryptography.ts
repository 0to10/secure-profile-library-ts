'use strict';

import * as pki from 'pkijs';

import {Crypto, CryptoKey} from '@peculiar/webcrypto';

import {Configuration} from './Configuration';
import {KeyDerivation} from './Cryptography/KeyDerivation';

if (typeof window === 'undefined') {
    pki.setEngine('node', new pki.CryptoEngine({
        crypto: new Crypto(),
    }) as pki.ICryptoEngine);
}

/**
 * Cryptography
 *
 * @copyright Copyright (c) 2023 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class Cryptography {

    public static getEngine(): pki.ICryptoEngine {
        const engine: pki.ICryptoEngine | null = pki.getCrypto(true);

        if (null === engine) {
            throw new Error('Unable to get cryptography engine.');
        }

        return engine;
    }

    public static async deriveSymmetricKeyFromPassword(
        password: string,
        salt: ArrayBuffer,
        length: number,
    ): Promise<CryptoKey> {
        const keyData: Uint8Array = await KeyDerivation.derive(password, salt, length, {
            N: 32768,
            r: 8,
            p: 1,
        });

        const crypto: pki.ICryptoEngine = Cryptography.getEngine();

        return crypto.importKey('raw', keyData, Configuration.masterKey, true, [
            'encrypt',
            'decrypt',
        ]);
    }

    public static async deriveSymmetricKeyFromSecret(
        secret: string,
        salt: Uint8Array,
        length: number,
    ): Promise<CryptoKey> {
        const keyData: Uint8Array = await KeyDerivation.derive(secret, salt, length, {
            N: 4096,
            r: 8,
            p: 1,
        });

        const crypto: pki.ICryptoEngine = Cryptography.getEngine();

        return crypto.importKey('raw', keyData, Configuration.masterKey, true, [
            'encrypt',
            'decrypt',
        ]);
    }

    public static async generateSymmetricKey(length: number): Promise<CryptoKey> {
        const crypto: pki.ICryptoEngine = Cryptography.getEngine();

        const algorithm: AesKeyGenParams = {
            name: 'AES-GCM',
            length,
        };

        return crypto.generateKey(algorithm, true, [
            'encrypt',
            'decrypt',
        ]);
    }

    public static async wrapKeyAsymmetrical(
        key: CryptoKey,
        wrappingKey: CryptoKey,
    ): Promise<ArrayBuffer> {
        if (!Cryptography.isAsymmetricalKey(wrappingKey)) {
            throw new Error('Encryption key must be wrapped using a public or private key.');
        }

        const crypto: pki.ICryptoEngine = Cryptography.getEngine();

        return crypto.wrapKey(
            'raw',
            key,
            wrappingKey,
            Configuration.asymmetricalKeyWrappingAlgorithm,
        );
    }

    public static async unwrapKeyAsymmetrical(
        encrypted: ArrayBuffer,
        unwrappingKey: CryptoKey,
        algorithm: KeyAlgorithm,
        extractable: boolean,
        usages: Array<KeyUsage>,
    ): Promise<CryptoKey> {
        if (!Cryptography.isAsymmetricalKey(unwrappingKey)) {
            throw new Error('Encryption key must be unwrapped using a public or private key.');
        }

        const crypto: pki.ICryptoEngine = Cryptography.getEngine();

        return crypto.unwrapKey(
            'raw',
            encrypted,
            unwrappingKey,
            Configuration.asymmetricalKeyWrappingAlgorithm,
            algorithm,
            extractable,
            usages,
        );
    }

    public static async encryptSymmetrical(
        key: CryptoKey,
        salt: ArrayBuffer,
        data: ArrayBuffer,
    ): Promise<ArrayBuffer> {
        const crypto: pki.ICryptoEngine = Cryptography.getEngine();

        const params: AesGcmParams = {
            name: 'AES-GCM',
            iv: salt,
        };

        return crypto.encrypt(params, key, data);
    }

    public static async decryptSymmetrical(
        key: CryptoKey,
        salt: ArrayBuffer,
        encrypted: ArrayBuffer,
    ): Promise<ArrayBuffer> {
        const crypto: pki.ICryptoEngine = Cryptography.getEngine();

        const params: AesGcmParams = {
            name: 'AES-GCM',
            iv: salt,
        };

        return crypto.decrypt(params, key, encrypted);
    }

    public static isAsymmetricalKey(key: CryptoKey): boolean {
        return ['public', 'private'].includes(key.type);
    }

    public static randomBytes(length: number): ArrayBuffer {
        return pki.getRandomValues(new Uint8Array(length)).buffer;
    }

}
