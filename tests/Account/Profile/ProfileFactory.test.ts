'use strict';

import {describe, expect, test} from '@jest/globals';

import {ProfileFactory} from '../../../src/Account/Profile/ProfileFactory';

import {Data} from '../../../src';
import {Profile} from '../../../src/Account/Profile/Profile';
import {RoamingProfile} from '../../../src/Account/Profile/RoamingProfile';


describe('ProfileFactory', (): void => {

    const profileFactory = new ProfileFactory();

    test.each([
        {
            input: undefined,
            expectedData: {},
        },
        {
            input: {
                test: 1,
                something: true,
                root: {
                    nested: 'test',
                },
            },
            expectedData: {
                'test': 1,
                'something': true,
                'root.nested': 'test',
            },
        },
    ])('.create($input)', async ({
        input,
        expectedData,
    }): Promise<void> => {
        const profile: Profile = await profileFactory.create(input);

        expect(profile).toBeInstanceOf(Profile);
        expect(profile).toBeInstanceOf(RoamingProfile);

        const roamingProfile: RoamingProfile = profile as RoamingProfile;

        expect(roamingProfile.data).toBeInstanceOf(Data);
        expect({...roamingProfile.data}).toStrictEqual(expectedData);
    });

});
