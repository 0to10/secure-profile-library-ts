'use strict';

import {MasterKeyVersion} from './MasterKeyVersion.type';

const DEFAULT_VERSION_NUMBER: number = 0;
const DEFAULT_VERSION: MasterKeyVersion = {
    number: DEFAULT_VERSION_NUMBER,
    algorithm: {
        name: 'AES-GCM',
        iv_length: 96,
    },
};

/**
 * CryptoVersions
 *
 * @copyright Copyright (c) 2024 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class CryptoVersions {

    private readonly versions: { [key: number]: MasterKeyVersion; } = {
        [DEFAULT_VERSION_NUMBER]: DEFAULT_VERSION,
    };

    constructor(
        versions: Array<MasterKeyVersion> = [],
    ) {
        for (const version of versions) {
            const number: number = version.number;

            if (this.has(number)) {
                throw new Error(`Duplicate version detected with number ${number}`);
            }

            this.versions[number] = version;
        }
    }

    public get(version: number): MasterKeyVersion | undefined {
        return this.versions[version];
    }

    public has(version: number): boolean {
        return this.versions.hasOwnProperty(version);
    }

}
