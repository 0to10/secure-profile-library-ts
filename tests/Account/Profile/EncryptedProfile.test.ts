'use strict';

import {describe, expect, test} from '@jest/globals';

import {Cryptography} from '../../../src/Cryptography';
import {KeyPairFactory} from '../../../src/KeyPairFactory';
import {MasterKey} from '../../../src/MasterKey';
import {Configuration, RoamingProfile} from '../../../src';

import {EncryptedProfile} from '../../../src/Account/Profile/EncryptedProfile';


describe('EncryptedProfile', (): void => {

    const salt: Uint8Array = Cryptography.randomBytes(200);

    test('new', async (): Promise<void> => {
        const encryptedProfile: EncryptedProfile = new EncryptedProfile(salt, Buffer.from(''));

        expect(encryptedProfile.sealed).toBeTruthy();
    });

    test('.decrypt()', async (): Promise<void> => {
        const keyPairFactory: KeyPairFactory = new KeyPairFactory(
            Configuration.encryptionKeyGenAlgorithm
        );

        const keyPair: CryptoKeyPair = await keyPairFactory.generateEncryption(true);

        const profile: RoamingProfile = new RoamingProfile(
            Cryptography.randomBytes(Configuration.masterSalt.bytes),
            keyPair,
        );

        profile.data.set('test', 'Some information that I need to remember');
        profile.data.set('bool', false);
        profile.data.set('number', 15);

        const masterKey: MasterKey = await profile.deriveMasterKey('my password');

        const encrypted: EncryptedProfile = await profile.encrypt(masterKey);
        const decrypted: RoamingProfile = await encrypted.decrypt(masterKey);

        expect(decrypted.data.get('test')).toStrictEqual('Some information that I need to remember');
        expect(decrypted.data.get('bool')).toStrictEqual(false);
        expect(decrypted.data.get('number')).toStrictEqual(15);

        const publicKey: CryptoKey = decrypted.agreementPublicKey();

        expect(publicKey).toStrictEqual(keyPair.publicKey);

        const textToEncrypt: string = 'this is the text I want to encrypt';

        const encryptedData: ArrayBuffer = await Cryptography.getEngine().subtle.encrypt({
            name: 'RSA-OAEP',
        }, publicKey, Buffer.from(textToEncrypt));

        const decryptedData: ArrayBuffer = await Cryptography.getEngine().subtle.decrypt({
            name: 'RSA-OAEP',
        }, keyPair.privateKey, encryptedData);

        const textDecoder: TextDecoder = new TextDecoder();

        expect(textDecoder.decode(decryptedData)).toStrictEqual(textToEncrypt);
    });

    test('.decrypt() fails with invalid data', async (): Promise<void> => {
        const encryptedProfile: EncryptedProfile = new EncryptedProfile(
            salt,
            Buffer.from('this is not encrypted')
        );

        const masterKey: MasterKey = await encryptedProfile.deriveMasterKey('my super secret text');

        await expect(async (): Promise<void> => {
            await encryptedProfile.decrypt(masterKey);
        }).rejects.toThrowError('Unable to decrypt the profile using the given master key.');
    });

    test('.decrypt() fails with non-JSON data', async (): Promise<void> => {
        const temp: EncryptedProfile = new EncryptedProfile(
            salt,
            Buffer.from('this is not encrypted')
        );

        const masterKey: MasterKey = await temp.deriveMasterKey('my super secret text');

        const encryptedProfile: EncryptedProfile = new EncryptedProfile(
            salt,
            await masterKey.encrypt(Buffer.from('This is not JSON'))
        );

        await expect(async (): Promise<void> => {
            await encryptedProfile.decrypt(masterKey);
        }).rejects.toThrowError('Unable to parse the decrypted profile. It may be corrupted.');
    });

});
