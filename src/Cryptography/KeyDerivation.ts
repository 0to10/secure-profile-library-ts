'use strict';

import * as unorm from 'unorm';

import {scrypt} from 'scrypt-js';

import {Cryptography} from '../Cryptography';

const crypto: SubtleCrypto = Cryptography.getEngine();

/**
 * KeyDerivation
 *
 * @copyright Copyright (c) 2024 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class KeyDerivation {

    /**
     * CPU/memory cost; increasing this increases the overall difficulty
     *
     * @private
     */
    private static readonly N: number = 32768;

    /**
     * Block size; increasing this increases the dependency on memory latency and bandwidth
     *
     * @private
     */
    private static readonly r: number = 8;

    /**
     * Parallelization cost; increasing this increases the dependency on multiprocessing
     *
     * @private
     */
    private static readonly p: number = 1;

    public static async fromPassword(password: string, salt: Uint8Array, length: number): Promise<Uint8Array> {
        const encoder: TextEncoder = new TextEncoder();

        password = unorm.nfkc(password);

        return scrypt(
            new Uint8Array(
                await crypto.digest('SHA-256', encoder.encode(password))
            ),
            salt,
            KeyDerivation.N,
            KeyDerivation.r,
            KeyDerivation.p,
            length,
        );
    }

}
