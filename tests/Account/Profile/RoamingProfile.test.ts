'use strict';

import {describe, expect, test} from '@jest/globals';

import {Cryptography} from '../../../src/Cryptography';
import {EncryptedProfile} from '../../../src/Account/Profile/EncryptedProfile';
import {KeyPairFactory} from '../../../src/KeyPairFactory';
import {MasterKey} from '../../../src/MasterKey';
import {Profile} from '../../../src/Account/Profile/Profile';

import {RoamingProfile} from '../../../src/Account/Profile/RoamingProfile';


describe('RoamingProfile', (): void => {

    const keyPairFactory: KeyPairFactory = new KeyPairFactory({
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-256',
    });

    test('new', async (): Promise<void> => {
        const profile: RoamingProfile = new RoamingProfile(
            Cryptography.randomBytes(200),
            await keyPairFactory.generateEncryption(true),
            {
                test: 1,
                keyboard: 'qwerty',
            },
        );

        expect(profile).toBeInstanceOf(Profile);
        expect(profile.sealed).toBeFalsy();

        expect(profile.data.get('test')).toStrictEqual(1);
        expect(profile.data.get('keyboard')).toStrictEqual('qwerty');
    });

    test('new with non-exportable agreement key', async (): Promise<void> => {
        const nonExportableKey: CryptoKeyPair = await keyPairFactory.generateEncryption(false);

        expect((): void => {
            new RoamingProfile(Cryptography.randomBytes(200), nonExportableKey);
        }).toThrowError('Public and private key of the client certificate must be exportable.');
    });

    test('new with non-scalar data', async (): Promise<void> => {
        const nonExportableKey: CryptoKeyPair = await keyPairFactory.generateEncryption(true);

        const invalidData: any = {
            invalid_entry: {
                bla: false,
            },
        };

        expect((): void => {
            new RoamingProfile(Cryptography.randomBytes(200), nonExportableKey, invalidData);
        }).toThrowError('Encountered invalid value type for key "invalid_entry" in data.');
    });

    test('.encrypt()', async (): Promise<void> => {
        const profile: RoamingProfile = new RoamingProfile(
            Cryptography.randomBytes(200),
            await keyPairFactory.generateEncryption(true),
        );

        profile.data.set('test', 'Some important information');
        profile.data.set('one', 1);

        const masterKey: MasterKey = await profile.deriveMasterKey('my super secret text');

        const encrypted: EncryptedProfile = await profile.encrypt(masterKey);
        expect(encrypted).toBeInstanceOf(EncryptedProfile);

        const decrypted: RoamingProfile = await encrypted.decrypt(masterKey);
        expect(decrypted).toBeInstanceOf(RoamingProfile);

        expect(decrypted.data.get('test')).toStrictEqual('Some important information');
        expect(decrypted.data.get('one')).toStrictEqual(1);

        expect(decrypted.data.get('not_set')).toBeUndefined();
    });

});
