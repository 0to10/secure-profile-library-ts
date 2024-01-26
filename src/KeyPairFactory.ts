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
        private readonly algorithm: RsaHashedKeyGenParams | EcKeyGenParams,
    ) {
        if (
            'modulusLength' in algorithm
            && algorithm.modulusLength < 2048
        ) {
            throw new Error('Modulus length below 2048 bits is considered unsafe');
        }

        this.crypto = Cryptography.getEngine();
    }

    public generateEncryption(exportable: boolean): Promise<CryptoKeyPair> {
        const usages: Array<KeyUsage> = [
            'encrypt',
            'decrypt',
        ];

        return this.crypto.generateKey(this.algorithm, exportable, usages);
    }

}
