'use strict';

import {CryptoKey} from '@peculiar/webcrypto';
import {scrypt} from 'scrypt-js';
import unorm from 'unorm';

import {Cryptography} from '../../Cryptography';
import {MasterKey} from '../../MasterKey';

const crypto: SubtleCrypto = Cryptography.getEngine();
const textEncoder: TextEncoder = new TextEncoder();

const MASTER_KEY_BITS: number = 256;

/**
 * Profile
 *
 * @copyright Copyright (c) 2023 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export abstract class Profile {

    protected constructor(
        public readonly masterSalt: Uint8Array,
        public readonly sealed: boolean,
    ) {
    }

    public async deriveMasterKey(
        password: string,
    ): Promise<MasterKey> {
        // The CPU/memory cost; increasing this increases the overall difficulty
        const N: number = 32768;
        // The block size; increasing this increases the dependency on memory latency and bandwidth
        const r: number = 8;
        // The parallelization cost; increasing this increases the dependency on multiprocessing
        const p: number = 1;

        const keyData: Uint8Array = await scrypt(
            this.encoder.encode(unorm.nfkc(password)),
            this.masterSalt,
            N,
            r,
            p,
            MASTER_KEY_BITS / 8
        );

        const algorithm: AesKeyGenParams = {
            name: 'AES-GCM',
            length: MASTER_KEY_BITS,
        };

        const cryptoKey: CryptoKey = await this.crypto.importKey('raw', keyData, algorithm, false, [
            'encrypt',
            'decrypt',
        ]);

        return new MasterKey(cryptoKey);
    }

    protected get crypto(): SubtleCrypto {
        return crypto;
    }

    protected get encoder(): TextEncoder {
        return textEncoder;
    }

}
