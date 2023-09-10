'use strict';

import {describe, expect, test} from '@jest/globals';

import {Cryptography} from '../../../src/Cryptography';
import {MasterKey} from '../../../src/MasterKey';

import {Profile} from '../../../src/Account/Profile/Profile';


class TestProfile extends Profile {
    constructor(masterSalt: Uint8Array) {
        super(masterSalt);
    }
}

describe('Profile', (): void => {

    const salt: Uint8Array = Cryptography.randomBytes(100);

    test('.deriveMasterKey()', async (): Promise<void> => {
        const profile: Profile = new TestProfile(salt);

        const masterKey: MasterKey = await profile.deriveMasterKey('1234567890');

        expect(masterKey).toBeInstanceOf(MasterKey);
        expect(profile.masterSalt).toStrictEqual(salt);
    });

});
