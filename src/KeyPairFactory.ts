'use strict';

import {Cryptography} from './Cryptography';

/**
 * KeyPairFactory
 *
 * @copyright Copyright (c) 2023 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class KeyPairFactory {

    private readonly crypto: SubtleCrypto;

    constructor(
        private readonly modulusLength: number,
    ) {
        if (modulusLength < 2048) {
            throw new Error('Modulus length below 2048 bits is considered unsafe');
        }

        this.crypto = Cryptography.getEngine();
    }

    public generateEncryption(exportable: boolean): Promise<CryptoKeyPair> {
        const usages: Array<KeyUsage> = [
            'encrypt',
            'decrypt',
        ];

        return this.generate(usages, exportable);
    }

    private async generate(
        keyUsages: Array<KeyUsage>,
        exportable: boolean = true,
    ): Promise<CryptoKeyPair> {
        const algorithm: RsaHashedKeyGenParams | EcKeyGenParams = {
            name: 'RSA-OAEP',
            modulusLength: this.modulusLength,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: 'SHA-256',
        };

        return this.crypto.generateKey(algorithm, exportable, keyUsages);
    }

}
