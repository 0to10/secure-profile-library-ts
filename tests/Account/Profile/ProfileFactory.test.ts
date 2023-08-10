'use strict';

import {describe, expect, test} from '@jest/globals';

import {ProfileFactory} from '../../../src/Account/Profile/ProfileFactory';
import {RoamingProfile} from '../../../src/Account/Profile/RoamingProfile';

import {Profile} from '../../../src/Account/Profile/Profile';


describe('ProfileFactory', (): void => {

    test('.create', async (): Promise<void> => {
        const profileFactory = new ProfileFactory();

        const profile: Profile = await profileFactory.create();

        expect(profile).toBeInstanceOf(Profile);
        expect(profile).toBeInstanceOf(RoamingProfile);
    });

});
