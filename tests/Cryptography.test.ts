'use strict';

import {describe, expect, test} from '@jest/globals';

import {CryptoEngine} from 'pkijs';

import {Cryptography} from '../src/Cryptography';


describe('Cryptography', (): void => {

    test('.getEngine()', (): void => {
        const engine: SubtleCrypto = Cryptography.getEngine();

        expect(engine).toBeInstanceOf(CryptoEngine);
    });

    test('.randomBytes()', (): void => {
        const randomBytes: ArrayBuffer = Cryptography.randomBytes(15);

        expect(randomBytes).toBeInstanceOf(Uint8Array);
        expect(randomBytes.byteLength).toStrictEqual(15);

        const textDecoder: TextDecoder = new TextDecoder();

        const first: string = textDecoder.decode(randomBytes);
        const second: string = textDecoder.decode(Cryptography.randomBytes(15));

        expect(first).not.toBe(second);
    });

});
