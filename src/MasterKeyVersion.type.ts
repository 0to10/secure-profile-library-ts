'use strict';

type Algorithms = Algorithm | RsaOaepParams | AesCtrParams | AesCbcParams | AesGcmParams;

/**
 * MasterKeyVersion
 *
 * @copyright Copyright (c) 2023 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export type MasterKeyVersion = {
    number: number;
    algorithm: Algorithms & {
        iv_length: number;
    };
};
