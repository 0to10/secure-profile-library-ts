'use strict';

import {Cryptography} from '../../Cryptography';
import {KeyPairFactory} from '../../KeyPairFactory';
import {Profile} from './Profile';
import {RoamingProfile} from './RoamingProfile';

const MASTER_SALT_BITS: number = 256;

/**
 * ProfileFactory
 *
 * @copyright Copyright (c) 2023 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class ProfileFactory {

    private readonly keyPairFactory: KeyPairFactory;

    constructor() {
        this.keyPairFactory = new KeyPairFactory({
            name: 'RSA-OAEP',
            modulusLength: 4096,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: 'SHA-256',
        });
    }

    public async create(): Promise<Profile> {
        const keyPair: CryptoKeyPair = await this.keyPairFactory.generateEncryption(true);

        return new RoamingProfile(
            Cryptography.randomBytes(MASTER_SALT_BITS / 8),
            keyPair,
        );
    }

}
