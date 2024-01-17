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

    private static versions: { [key: number]: MasterKeyVersion; } = {
        [DEFAULT_VERSION_NUMBER]: DEFAULT_VERSION,
    };

    public static configure(
        versions: Array<MasterKeyVersion> = [],
    ): void {
        for (const version of versions) {
            const number: number = version.number;

            if (undefined !== CryptoVersions.versions[number]) {
                throw new Error(`Duplicate version detected with number ${number}`);
            }

            this.versions[number] = version;
        }
    }

    public get(version: number): MasterKeyVersion | undefined {
        return CryptoVersions.versions[version];
    }

    public has(version: number): boolean {
        return undefined !== CryptoVersions.versions[version];
    }

}
