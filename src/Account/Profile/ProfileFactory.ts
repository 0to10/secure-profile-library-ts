'use strict';

import {Configuration} from '../../Configuration';
import {Cryptography} from '../../Cryptography';
import {Data} from '../Data';
import {KeyPairFactory} from '../../KeyPairFactory';
import {RoamingProfile} from './RoamingProfile';

/**
 * ProfileFactory
 *
 * @copyright Copyright (c) 2023 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class ProfileFactory {

    private readonly keyPairFactory: KeyPairFactory;

    constructor() {
        this.keyPairFactory = new KeyPairFactory(Configuration.encryptionKeyGenAlgorithm);
    }

    public async create(
        data?: Record<string, any>,
    ): Promise<RoamingProfile> {
        const keyPair: CryptoKeyPair = await this.keyPairFactory.generateEncryption(true);

        const salt: ArrayBuffer = Cryptography.randomBytes(Configuration.masterSalt.bytes);

        const profile = new RoamingProfile(salt, keyPair);
        profile.data = Data.fromObject({...data});

        return profile;
    }

}
