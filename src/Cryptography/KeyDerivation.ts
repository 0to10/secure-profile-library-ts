'use strict';

import * as unorm from 'unorm';

import {scrypt} from 'scrypt-js';

/**
 * KeyDerivation
 *
 * @copyright Copyright (c) 2024 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class KeyDerivation {

    public static async fromPassword(password: string, salt: Uint8Array, length: number): Promise<Uint8Array> {
        password = unorm.nfkc(password);

        // The CPU/memory cost; increasing this increases the overall difficulty
        const N: number = 32768;
        // The block size; increasing this increases the dependency on memory latency and bandwidth
        const r: number = 8;
        // The parallelization cost; increasing this increases the dependency on multiprocessing
        const p: number = 1;

        const encoder: TextEncoder = new TextEncoder();

        return scrypt(
            encoder.encode(password),
            salt,
            N,
            r,
            p,
            length,
        );
    }

}
