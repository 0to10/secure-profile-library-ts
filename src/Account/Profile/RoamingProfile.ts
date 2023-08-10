'use strict';

import {Profile} from './Profile';

interface CryptoKeyPairMap {
    [key: string]: CryptoKeyPair | undefined;
}

/**
 * RoamingProfile
 *
 * The roaming profile is the profile in unencrypted form. The roaming profile MUST
 * never leave the user device.
 *
 * @copyright Copyright (c) 2023 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class RoamingProfile extends Profile {

    constructor(
        masterSalt: ArrayBuffer,
        private readonly clientCertificate: CryptoKeyPair,
        private agreements: CryptoKeyPairMap = {},
    ) {
        super(masterSalt);
    }

}
