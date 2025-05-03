'use strict';

import {CryptoKey} from '@peculiar/webcrypto';

import {Configuration} from '../../Configuration';
import {Cryptography} from '../../Cryptography';
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
        public readonly masterSalt: ArrayBuffer,
        public readonly sealed: boolean,
    ) {
    }

    public async deriveMasterKey(
        password: string,
    ): Promise<MasterKey> {
        const keyLength: number = Configuration.masterKey.length / 8;

        const cryptoKey: CryptoKey = await Cryptography.deriveSymmetricKeyFromPassword(
            password,
            this.masterSalt,
            keyLength,
        );

        return new MasterKey(cryptoKey);
    }

    protected get crypto(): SubtleCrypto {
        return crypto;
    }

}
