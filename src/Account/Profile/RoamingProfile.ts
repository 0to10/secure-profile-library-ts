'use strict';

import {CryptoKeyPairMap} from '../CryptoKeyPairMap.type';
import {EncryptedProfile} from './EncryptedProfile';
import {MasterKey} from '../../MasterKey';
import {Profile} from './Profile';
import {Data} from '../Data';

/**
 * RoamingProfile
 *
 * The roaming profile is the profile in unencrypted form. The roaming profile MUST
 * never leave the user device.
 *
 * @copyright Copyright (c) 2023 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class RoamingProfile extends Profile {

    protected deviceCertificates: CryptoKeyPairMap = {};

    private profileData: Data<string | number> = new Data<string | number>();

    constructor(
        masterSalt: Uint8Array,
        private readonly agreementKey: CryptoKeyPair,
        data: any = undefined,
    ) {
        super(masterSalt, false);

        if (
            !agreementKey.publicKey.extractable
            || !agreementKey.privateKey.extractable
        ) {
            throw new Error('Public and private key of the client certificate must be exportable.');
        }

        this.data = data;
    }

    public get data(): typeof this.profileData {
        return this.profileData;
    }

    public set data(data: any) {
        if ('object' === typeof data) {
            this.setDataFromObject(data);
        }
    }

    private setDataFromObject(data: Object): void {
        for (const key in data) {
            const value: unknown = data[key];

            if (!['number', 'string'].includes(typeof value)) {
                throw new Error(`Encountered invalid value type for key "${key}" in data.`);
            }

            this.profileData.set(key, value as string | number);
        }
    }

    public async encrypt(masterKey: MasterKey): Promise<EncryptedProfile> {
        const algorithm: Algorithm = {
            name: 'AES-KW',
        };

        const deviceCertificates: any = {};
        for (const [agreement, agreementKeyPair] of Object.entries(this.deviceCertificates)) {
            for (const [keyType, key] of Object.entries(agreementKeyPair)) {
                deviceCertificates[agreement][keyType] = this.crypto.wrapKey(
                    'raw',
                    key,
                    this.agreementKey.privateKey,
                    algorithm
                );
            }
        }

        const unencryptedData: ArrayBuffer = Buffer.from(JSON.stringify({
            agreement_key: await this.exportKeyPair(this.agreementKey),
            device_certificates: deviceCertificates,
            profile_data: this.profileData,
        }));

        return new EncryptedProfile(
            this.masterSalt,
            await masterKey.encrypt(unencryptedData),
        );
    }

    private async exportKeyPair(keyPair: CryptoKeyPair): Promise<any> {
        return {
            public: await this.crypto.exportKey('jwk', keyPair.publicKey),
            private: await this.crypto.exportKey('jwk', keyPair.privateKey),
        };
    }

}
