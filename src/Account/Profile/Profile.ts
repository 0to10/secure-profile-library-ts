'use strict';

import {Cryptography} from '../../Cryptography';
import {MasterKey} from '../../MasterKey';

/**
 * Profile
 *
 * @copyright Copyright (c) 2023 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export abstract class Profile {

    protected readonly crypto: SubtleCrypto;
    private readonly encoder: TextEncoder;

    protected constructor(
        protected readonly masterSalt: ArrayBuffer,
    ) {
        this.crypto = Cryptography.getEngine();
        this.encoder = new TextEncoder();
    }

    public async deriveMasterKey(
        password: string,
    ): Promise<MasterKey> {
        const algorithm: Pbkdf2Params = {
            name: 'PBKDF2',
            salt: this.masterSalt,
            iterations: 100000,
            hash: 'SHA-256',
        };

        const parameters: AesKeyGenParams = {
            name: 'AES-GCM',
            length: 256,
        };

        const usages: Array<KeyUsage> = [
            'encrypt',
            'decrypt',
        ];

        const derivedData: CryptoKey = await this.crypto.deriveKey(
            algorithm,
            await this.crypto.importKey('raw', this.encoder.encode(password), 'PBKDF2', false, [
                'deriveKey',
            ]),
            parameters,
            false,
            usages,
        );

        return new MasterKey(derivedData);
    }

}
