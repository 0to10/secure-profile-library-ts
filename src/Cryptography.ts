'use strict';

import * as pkijs from 'pkijs';

import {Crypto as WebCrypto} from '@peculiar/webcrypto';
import {CryptoEngine} from 'pkijs';

import {Configuration} from './Configuration';

pkijs.setEngine('node', new CryptoEngine({
    crypto: new WebCrypto(),
}));

/**
 * Cryptography
 *
 * @copyright Copyright (c) 2023 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class Cryptography {

    public static getEngine(): pkijs.ICryptoEngine {
        const engine: pkijs.ICryptoEngine | null = pkijs.getCrypto(true);

        if (null === engine) {
            throw new Error('Unable to get cryptography engine.');
        }

        return engine;
    }

    public static async wrapKeyAsymmetrical(
        key: CryptoKey,
        wrappingKey: CryptoKey,
    ): Promise<ArrayBuffer> {
        if (!Cryptography.isAsymmetricalKey(wrappingKey)) {
            throw new Error('Encryption key must be wrapped using a public or private key.');
        }

        const crypto: pkijs.ICryptoEngine = Cryptography.getEngine();

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

        const crypto: pkijs.ICryptoEngine = Cryptography.getEngine();

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

    public static isAsymmetricalKey(key: CryptoKey): boolean {
        return ['public', 'private'].includes(key.type);
    }

    public static randomBytes(length: number): Uint8Array {
        return pkijs.getRandomValues(new Uint8Array(length));
    }

}
