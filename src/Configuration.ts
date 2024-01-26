'use strict';

/**
 * Configuration
 *
 * @copyright Copyright (c) 2024 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class Configuration {

    public static encryptionKeyGenAlgorithm: RsaHashedKeyGenParams | EcKeyGenParams = {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-256',
    };

    public static get encryptionImportAlgorithm(): RsaHashedImportParams | EcKeyImportParams {
        return Configuration.removePropertiesFromObject(Configuration.encryptionKeyGenAlgorithm, [
            'modulusLength',
            'publicExponent',
        ]) as RsaHashedImportParams | EcKeyImportParams;
    }

    private static removePropertiesFromObject(object: object, removeProperties: string[]): object {
        for (const removeProperty of removeProperties) {
            if (removeProperty in object) {
                delete object[removeProperty];
            }
        }

        return object;
    }

}
