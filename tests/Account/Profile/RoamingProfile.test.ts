'use strict';

import {describe, expect, test} from '@jest/globals';

import {Configuration} from '../../../src/Configuration';
import {Cryptography} from '../../../src/Cryptography';
import {Data} from '../../../src/Account/Data';
import {EncryptedProfile} from '../../../src/Account/Profile/EncryptedProfile';
import {KeyPairFactory} from '../../../src/KeyPairFactory';
import {MasterKey} from '../../../src/MasterKey';
import {Profile} from '../../../src/Account/Profile/Profile';

import {RoamingProfile} from '../../../src/Account/Profile/RoamingProfile';


describe('RoamingProfile', (): void => {

    const keyPairFactory: KeyPairFactory = new KeyPairFactory(Configuration.encryptionKeyGenAlgorithm);

    test('new', async (): Promise<void> => {
        const profile: RoamingProfile = new RoamingProfile(
            Cryptography.randomBytes(200),
            await keyPairFactory.generateEncryption(true),
        );

        profile.data = Data.fromObject({
            test: 1,
            keyboard: 'qwerty',
        });

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

    test('.agreementPublicKey()', async (): Promise<void> => {
        const keypair: CryptoKeyPair = await keyPairFactory.generateEncryption(true);

        const profile: RoamingProfile = new RoamingProfile(Cryptography.randomBytes(200), keypair);

        expect(profile.agreementPublicKey()).toStrictEqual(keypair.publicKey);
    });

    test('.rotateAgreementKey()', async (): Promise<void> => {
        const keypair: CryptoKeyPair = await keyPairFactory.generateEncryption(true);

        const profile: RoamingProfile = new RoamingProfile(Cryptography.randomBytes(200), keypair);
        await profile.rotateAgreementKey();

        const newPublicKey: CryptoKey = profile.agreementPublicKey();

        // expect(newPublicKey).not.toStrictEqual(keypair.publicKey);

        expect(newPublicKey.algorithm).toStrictEqual(keypair.publicKey.algorithm);
        expect(newPublicKey.usages).toStrictEqual(keypair.publicKey.usages);
        expect(newPublicKey.extractable).toStrictEqual(keypair.publicKey.extractable);
        expect(newPublicKey.type).toStrictEqual(keypair.publicKey.type);
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
