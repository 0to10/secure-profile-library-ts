'use strict';

import {describe, expect, test} from '@jest/globals';

import {Cryptography} from '../../../src/Cryptography';
import {MasterKey} from '../../../src/MasterKey';

import {Profile} from '../../../src/Account/Profile/Profile';


class TestProfile extends Profile {
    constructor(masterSalt: Uint8Array) {
        super(masterSalt, false);
    }

    public getMasterSalt(): Uint8Array {
        return this.masterSalt;
    }
}

describe('Profile', (): void => {

    const salt: Uint8Array = Cryptography.randomBytes(100);

    test('.deriveMasterKey()', async (): Promise<void> => {
        const profile: TestProfile = new TestProfile(salt);

        const masterKey: MasterKey = await profile.deriveMasterKey('1234567890');

        expect(masterKey).toBeInstanceOf(MasterKey);
        expect(profile.getMasterSalt()).toStrictEqual(salt);
    });

});
