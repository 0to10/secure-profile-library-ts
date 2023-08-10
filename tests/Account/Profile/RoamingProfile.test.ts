'use strict';

import {describe, expect, test} from '@jest/globals';

import {Cryptography} from '../../../src/Cryptography';
import {KeyPairFactory} from '../../../src/KeyPairFactory';
import {Profile} from '../../../src/Account/Profile/Profile';

import {RoamingProfile} from '../../../src/Account/Profile/RoamingProfile';


describe('RoamingProfile', (): void => {

    const keyPairFactory: KeyPairFactory = new KeyPairFactory(2048);

    test('new', async (): Promise<void> => {
        const profile: RoamingProfile = new RoamingProfile(
            Cryptography.randomBytes(200),
            await keyPairFactory.generateEncryption(true),
        );

        expect(profile).toBeInstanceOf(Profile);
    });

});
