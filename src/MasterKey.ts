'use strict';

import {Cryptography} from './Cryptography';
import {CryptoParameters} from './CryptoParameters.type';
import {CryptoVersions} from './CryptoVersions';
import {MasterKeyVersion} from './MasterKeyVersion.type';
import {NumberTransformer} from './Util/NumberTransformer';

/**
 * MasterKey
 *
 * @copyright Copyright (c) 2023 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class MasterKey {

    private static readonly crypto: SubtleCrypto = Cryptography.getEngine();

    private readonly versions: CryptoVersions = new CryptoVersions();

    constructor(
        private readonly key: CryptoKey,
    ) {
    }

    public async encrypt(
        data: ArrayBuffer,
        versionNumber: number = 0,
    ): Promise<ArrayBuffer> {
        if (!this.versions.has(versionNumber)) {
            throw new Error(`Version ${versionNumber} does not exist.`);
        }

        const version: MasterKeyVersion = this.versions.get(versionNumber);

        const versionEncoded: Uint8Array = NumberTransformer.toUint8Array(versionNumber);

        const iv: ArrayBuffer = Cryptography.randomBytes(version.algorithm.iv_length);

        const params: CryptoParameters = {
            name: version.algorithm.name,
            iv,
        };

        const promise: Promise<ArrayBuffer> = MasterKey.crypto.encrypt(params, this.key, data);

        const DATA_OFFSET: number = 1 + versionEncoded.length;

        return promise.then((encrypted: ArrayBuffer): ArrayBuffer => {
            const result: Uint8Array = new Uint8Array(DATA_OFFSET + iv.byteLength + encrypted.byteLength);
            result.set([versionEncoded.length], 0);
            result.set(versionEncoded, 1);
            result.set(new Uint8Array(iv), DATA_OFFSET);
            result.set(new Uint8Array(encrypted), DATA_OFFSET + iv.byteLength);

            return result;
        });
    }

    public decrypt(
        encrypted: ArrayBuffer,
    ): Promise<ArrayBuffer> {
        // Determine the offset of where the actual encrypted data starts:
        // - 1 byte for storing the version
        // - with the stored length
        const DATA_OFFSET: number = 1 + encrypted[0];

        const versionNumber: number = NumberTransformer.fromUint8Array(
            new Uint8Array(encrypted.slice(1, DATA_OFFSET))
        );

        const version: MasterKeyVersion = this.versions.get(versionNumber);

        const iv: ArrayBuffer = encrypted.slice(DATA_OFFSET, DATA_OFFSET + version.algorithm.iv_length);

        const params: AesGcmParams = {
            name: version.algorithm.name,
            iv,
        };

        const data: ArrayBuffer = encrypted.slice(DATA_OFFSET + version.algorithm.iv_length);

        return MasterKey.crypto.decrypt(params, this.key, data);
    }

}
