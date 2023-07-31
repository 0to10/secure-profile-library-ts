'use strict';

import {Cryptography} from './Cryptography';
import {MasterKeyVersion} from './MasterKeyVersion';

const DEFAULT_VERSION: MasterKeyVersion = {
    number: 0,
    algorithm: {
        name: 'AES-GCM',
        iv_length: 96,
    },
};

/**
 * MasterKey
 *
 * @copyright Copyright (c) 2023 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class MasterKey {

    private readonly crypto: SubtleCrypto;

    constructor(
        private readonly key: CryptoKey,
        private readonly versions: Array<MasterKeyVersion> = [DEFAULT_VERSION],
    ) {
        this.crypto = Cryptography.getEngine();
    }

    public encrypt(
        data: ArrayBuffer,
        version: MasterKeyVersion = DEFAULT_VERSION,
    ): Promise<ArrayBuffer> {
        if (version.number > 255) {
            throw new Error('Version numbers above 255 are not supported');
        }

        const VERSION_LENGTH: number = 1;

        const iv: ArrayBuffer = Cryptography.randomBytes(version.algorithm.iv_length);

        const params: AesGcmParams = {
            name: version.algorithm.name,
            iv,
        };

        const promise: Promise<ArrayBuffer> = this.crypto.encrypt(params, this.key, data);

        const DATA_OFFSET: number = 1 + VERSION_LENGTH;

        return promise.then((encrypted: ArrayBuffer): ArrayBuffer => {
            const result: Uint8Array = new Uint8Array(DATA_OFFSET + iv.byteLength + encrypted.byteLength);
            result.set([1], 0);
            result.set([version.number], 1);
            result.set(new Uint8Array(iv), DATA_OFFSET);
            result.set(new Uint8Array(encrypted), DATA_OFFSET + iv.byteLength);

            return result;
        });
    }

    public decrypt(
        encrypted: ArrayBuffer,
    ): Promise<ArrayBuffer> {
        const version: MasterKeyVersion = this.getVersionFromEncryptedData(encrypted);

        // Determine the offset of where the actual encrypted data starts:
        // - 1 byte for storing the version
        // - with the stored length
        const DATA_OFFSET: number = 1 + encrypted[0];

        const iv: ArrayBuffer = encrypted.slice(DATA_OFFSET, DATA_OFFSET + version.algorithm.iv_length);

        const params: AesGcmParams = {
            name: version.algorithm.name,
            iv,
        };

        const data: ArrayBuffer = encrypted.slice(DATA_OFFSET + version.algorithm.iv_length);

        return this.crypto.decrypt(params, this.key, data);
    }

    private getVersionFromEncryptedData(encrypted: ArrayBuffer): MasterKeyVersion {
        let versionNumber: number = 0;
        for (let i = 1; i <= encrypted[0]; i++) {
            versionNumber |= encrypted[i] << (i * 8);
        }

        return this.versions.find(version => {
            let currentVersionNumber: number = 0;
            for (let i = 0; i < 1; i++) {
                currentVersionNumber |= version.number[i] << (i * 8);
            }

            return versionNumber === currentVersionNumber;
        });
    }

}
