'use strict';

import {describe, expect, test} from '@jest/globals';

import {ProfileSerializer} from '../../../src/Account/Profile/ProfileSerializer';
import {EncryptedProfile, ProfileFactory, RoamingProfile} from '../../../src';


describe('ProfileSerializer', (): void => {

    const serializer: ProfileSerializer = new ProfileSerializer();

    const profileFactory: ProfileFactory = new ProfileFactory();

    const encoder: TextEncoder = new TextEncoder();
    const salt: Uint8Array = encoder.encode('some salt');

    test.each([
        {
            profile: new EncryptedProfile(salt, encoder.encode('This is the unencrypted data.')),
            expectedSerialized: '{"iv":"c29tZSBzYWx0","data":"VGhpcyBpcyB0aGUgdW5lbmNyeXB0ZWQgZGF0YS4="}',
        },
    ])('.serialize()', async ({
        profile,
        expectedSerialized,
    }): Promise<void> => {
        const serialized: string = serializer.serialize(profile);

        expect(typeof serialized).toBe('string');
        expect(serialized).toStrictEqual(expectedSerialized)

        const deserialized: EncryptedProfile = serializer.deserialize(serialized);

        expect(deserialized).toStrictEqual(profile);
    });

    test('.serialize() with non-encrypted', async (): Promise<void> => {
        const profile: RoamingProfile = await profileFactory.create();

        expect((): void => {
            serializer.serialize(profile);
        }).toThrowError('Only encrypted profiles may be serialized.');
    });

    test.each([
        {
            input: 'invalid json',
            expectedError: 'Unable to decode serialized profile.',
        },
        {
            input: '1',
            expectedError: 'Parsed profile is expected to be an object.',
        },
        {
            input: '{}',
            expectedError: 'Parsed profile is expected to contain a base64-encoded "iv" entry.',
        },
        {
            input: '{"iv":"this is not valid"}',
            expectedError: 'Parsed profile is expected to contain a base64-encoded "iv" entry.',
        },
        {
            input: '{"iv":"123="}',
            expectedError: 'Parsed profile is expected to contain a base64-encoded "data" entry.',
        },
        {
            input: '{"iv":"123=","data":"no no"}',
            expectedError: 'Parsed profile is expected to contain a base64-encoded "data" entry.',
        },
    ])('.deserialize($input)', async ({
        input,
        expectedError,
    }): Promise<void> => {
        expect((): void => {
            serializer.deserialize(input);
        }).toThrowError(expectedError)
    });

});
