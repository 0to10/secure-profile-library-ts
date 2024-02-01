'use strict';

import {ObjectHelper} from './Util/ObjectHelper';

/**
 * Configuration
 *
 * @copyright Copyright (c) 2024 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class Configuration {

    public static readonly masterKey: AesKeyGenParams = {
        name: 'AES-GCM',
        length: 256,
    };

    public static readonly masterSalt: { bytes: number; } = {
        // 32 bytes = 256 bits
        bytes: 32,
    };

    public static encryptionKeyGenAlgorithm: RsaHashedKeyGenParams | EcKeyGenParams = {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-256',
    };

    public static get encryptionImportAlgorithm(): RsaHashedImportParams | EcKeyImportParams {
        return ObjectHelper.removeProperties(Configuration.encryptionKeyGenAlgorithm, [
            'modulusLength',
            'publicExponent',
        ]) as RsaHashedImportParams | EcKeyImportParams;
    }

}
