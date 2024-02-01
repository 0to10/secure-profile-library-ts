'use strict';

import {CryptoKey} from '@peculiar/webcrypto';

import {Cryptography} from '../../Cryptography';
import {KeyDerivation} from '../../Cryptography/KeyDerivation';
import {MasterKey} from '../../MasterKey';

const crypto: SubtleCrypto = Cryptography.getEngine();

const MASTER_KEY_BITS: number = 256;

/**
 * Profile
 *
 * @copyright Copyright (c) 2023 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export abstract class Profile {

    protected constructor(
        public readonly masterSalt: Uint8Array,
        public readonly sealed: boolean,
    ) {
    }

    public async deriveMasterKey(
        password: string,
    ): Promise<MasterKey> {
        const keyData: Uint8Array = await KeyDerivation.fromPassword(
            password,
            this.masterSalt,
            MASTER_KEY_BITS / 8,
        );

        const algorithm: AesKeyGenParams = {
            name: 'AES-GCM',
            length: MASTER_KEY_BITS,
        };

        const cryptoKey: CryptoKey = await this.crypto.importKey('raw', keyData, algorithm, false, [
            'encrypt',
            'decrypt',
        ]);

        return new MasterKey(cryptoKey);
    }

    protected get crypto(): SubtleCrypto {
        return crypto;
    }

}
