'use strict';

import {MasterKey} from '../../MasterKey';
import {Profile} from './Profile';
import {RoamingProfile} from './RoamingProfile';
import {CryptoKey} from '@peculiar/webcrypto';

const decoder: TextDecoder = new TextDecoder();

/**
 * EncryptedProfile
 *
 * The encrypted variant of the Profile class. Instances of this class MAY be stored
 * remotely.
 *
 * @copyright Copyright (c) 2023 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class EncryptedProfile extends Profile {

    constructor(
        masterSalt: Uint8Array,
        private readonly data: ArrayBuffer,
    ) {
        super(masterSalt, true);
    }

    public async decrypt(masterKey: MasterKey): Promise<RoamingProfile> {
        let decrypted: ArrayBuffer;

        try {
            decrypted = await masterKey.decrypt(this.data);
        } catch (e) {
            throw new Error('Unable to decrypt the profile using the given master key.');
        }

        let decoded: any;

        try {
            decoded = JSON.parse(decoder.decode(decrypted));
        } catch (e) {
            throw new Error('Unable to parse the decrypted profile. It may be corrupted.');
        }

        return new RoamingProfile(
            this.masterSalt,
            await this.importKey(decoded.agreement_key),
            decoded.profile_data ?? {},
        );
    }

    private async importKey(data: { public: any; private: any; }): Promise<CryptoKeyPair> {
        const algorithm: any = {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
        };

        const privateKey: CryptoKey = await this.crypto.importKey('jwk', data.private, algorithm, true, ['encrypt']);
        const publicKey: CryptoKey = await this.crypto.importKey('jwk', data.public, algorithm, true, ['encrypt']);

        return new class implements CryptoKeyPair {
            privateKey: CryptoKey = privateKey;
            publicKey: CryptoKey = publicKey;
        };
    }

}
