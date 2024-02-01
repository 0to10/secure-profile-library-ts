'use strict';

import {CryptoKey} from '@peculiar/webcrypto';

import {Configuration} from '../../Configuration';
import {Cryptography} from '../../Cryptography';
import {KeyDerivation} from '../../Cryptography/KeyDerivation';
import {MasterKey} from '../../MasterKey';

const crypto: SubtleCrypto = Cryptography.getEngine();

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
            Configuration.masterKey.length / 8,
        );

        const cryptoKey: CryptoKey = await this.crypto.importKey('raw', keyData, Configuration.masterKey, false, [
            'encrypt',
            'decrypt',
        ]);

        return new MasterKey(cryptoKey);
    }

    protected get crypto(): SubtleCrypto {
        return crypto;
    }

}
