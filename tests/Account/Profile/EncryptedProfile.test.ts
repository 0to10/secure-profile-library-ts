'use strict';

import {describe, expect, test} from '@jest/globals';

import {Cryptography} from '../../../src/Cryptography';
import {MasterKey} from '../../../src/MasterKey';

import {EncryptedProfile} from '../../../src/Account/Profile/EncryptedProfile';


describe('EncryptedProfile', (): void => {

    const salt: Uint8Array = Cryptography.randomBytes(200);

    // test('new', async (): Promise<void> => {
    //
    // });

    test('decrypt() fails with invalid data', async (): Promise<void> => {
        const encryptedProfile: EncryptedProfile = new EncryptedProfile(
            salt,
            Buffer.from('this is not encrypted')
        );

        const masterKey: MasterKey = await encryptedProfile.deriveMasterKey('my super secret text');

        await expect(async (): Promise<void> => {
            await encryptedProfile.decrypt(masterKey);
        }).rejects.toThrowError('Unable to decrypt the profile using the given master key.');
    });

    test('decrypt() fails with non-JSON data', async (): Promise<void> => {
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
