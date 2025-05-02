'use strict';

import {ArrayBufferTransformer} from '../../Util/ArrayBufferTransformer';
import {EncryptedProfile} from './EncryptedProfile';
import {Profile} from './Profile';

/**
 * ProfileSerializer
 *
 * @copyright Copyright (c) 2025 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class ProfileSerializer {

    public serialize(profile: Profile): string {
        if (!(profile instanceof EncryptedProfile)) {
            throw new Error('Only encrypted profiles may be serialized.');
        }

        return JSON.stringify({
            iv: ArrayBufferTransformer.toBase64(profile.masterSalt),
            data: ArrayBufferTransformer.toBase64(profile.data),
        });
    }

    public deserialize(serialized: string): EncryptedProfile {
        const parsed: any = this.parse(serialized);

        if ('object' !== typeof parsed) {
            throw new Error('Parsed profile is expected to be an object.');
        }

        const regex: RegExp = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;

        for (const entry of ['iv', 'data']) {
            if (
                'string' === typeof parsed[entry]
                && regex.test(parsed[entry])
            ) {
                continue;
            }

            throw new Error(`Parsed profile is expected to contain a base64-encoded "${entry}" entry.`);
        }

        const salt: ArrayBuffer = ArrayBufferTransformer.fromBase64(parsed.iv);

        return new EncryptedProfile(
            new Uint8Array(salt),
            ArrayBufferTransformer.fromBase64(parsed.data),
        );
    }

    private parse(serialized: string): any {
        try {
            return JSON.parse(serialized);
        } catch (_error: any) {
            throw new Error('Unable to decode serialized profile.');
        }
    }
}
