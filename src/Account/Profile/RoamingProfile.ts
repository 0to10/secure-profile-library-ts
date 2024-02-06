'use strict';

// import {CryptoKeyPairMap} from '../CryptoKeyPairMap.type';
import {Data} from '../Data';
import {EncryptedProfile} from './EncryptedProfile';
import {MasterKey} from '../../MasterKey';
import {Profile} from './Profile';

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

    // protected deviceCertificates: CryptoKeyPairMap = {};

    private _data: Data = new Data();

    constructor(
        masterSalt: Uint8Array,
        private readonly agreementKey: CryptoKeyPair,
    ) {
        super(masterSalt, false);

        if (
            !agreementKey.publicKey.extractable
            || !agreementKey.privateKey.extractable
        ) {
            throw new Error('Public and private key of the client certificate must be exportable.');
        }
    }

    public get data(): Data {
        return this._data;
    }

    public set data(data: Data) {
        this._data = data;
    }

    public async encrypt(masterKey: MasterKey): Promise<EncryptedProfile> {
        // const algorithm: Algorithm = {
        //     name: 'AES-KW',
        // };

        const deviceCertificates: any = {};
        // for (const [agreement, deviceKeyPair] of Object.entries(this.deviceCertificates)) {
        //     for (const [keyType, key] of Object.entries(deviceKeyPair)) {
        //         deviceCertificates[agreement][keyType] = this.crypto.wrapKey(
        //             'raw',
        //             key,
        //             this.agreementKey.privateKey,
        //             algorithm
        //         );
        //     }
        // }

        const unencryptedData: ArrayBuffer = Buffer.from(JSON.stringify({
            agreement_key: await this.exportKeyPair(this.agreementKey),
            device_certificates: deviceCertificates,
            profile_data: this._data,
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
