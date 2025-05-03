'use strict';

import {nfkc} from 'unorm';
import {scrypt} from 'scrypt-js';

import {Cryptography} from '../Cryptography';
import {KeyDerivationOptions as Options} from './KeyDerivationOptions.type';

const encoder: TextEncoder = new TextEncoder();

/**
 * KeyDerivation
 *
 * @copyright Copyright (c) 2024 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class KeyDerivation {

    public static async derive(
        input: string,
        salt: ArrayBuffer,
        length: number,
        options: Options,
    ): Promise<Uint8Array> {
        const crypto: SubtleCrypto = Cryptography.getEngine();

        const {N, r, p}: Options = options;

        const digest: ArrayBuffer = await crypto.digest('SHA-256', encoder.encode(nfkc(input)));

        return scrypt(new Uint8Array(digest), new Uint8Array(salt), N, r, p, length);
    }

}
