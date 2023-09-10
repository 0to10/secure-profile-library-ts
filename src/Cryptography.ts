'use strict';

import * as pkijs from 'pkijs';

import {Crypto as WebCrypto} from '@peculiar/webcrypto';
import {CryptoEngine} from 'pkijs';

pkijs.setEngine('node', new CryptoEngine({
    crypto: new WebCrypto(),
}));

/**
 * Cryptography
 *
 * @copyright Copyright (c) 2023 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class Cryptography {

    public static getEngine(): pkijs.ICryptoEngine {
        const engine: pkijs.ICryptoEngine | null = pkijs.getCrypto(true);

        if (null === engine) {
            throw new Error('Unable to get cryptography engine.');
        }

        return engine;
    }

    public static randomBytes(length: number): Uint8Array {
        return pkijs.getRandomValues(new Uint8Array(length));
    }

}
