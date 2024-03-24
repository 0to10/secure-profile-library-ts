'use strict';

import {describe, expect, test} from '@jest/globals';

import {CryptoEngine} from 'pkijs';

import {Cryptography} from '../src/Cryptography';


describe('Cryptography', (): void => {

    const crypto: SubtleCrypto = Cryptography.getEngine();

    test('.getEngine()', (): void => {
        const engine: SubtleCrypto = Cryptography.getEngine();

        expect(engine).toBeInstanceOf(CryptoEngine);
    });

    // test('.wrapKeyAsymmetrical()', async (): Promise<void> => {
    //
    // });

    test('.wrapKeyAsymmetrical() with non-asymmetrical key', async (): Promise<void> => {
        const key: CryptoKey = await crypto.generateKey({
            name: 'AES-GCM',
            length: 256,
        }, true, ['encrypt', 'decrypt']) as CryptoKey;

        await expect(async (): Promise<void> => {
            await Cryptography.wrapKeyAsymmetrical(key, key);
        }).rejects.toThrowError('Encryption key must be wrapped using a public or private key.')
    });

    test.each([
        {
            algorithm: {
                name: 'AES-GCM',
                length: 256,
            },
            usages: ['encrypt', 'decrypt'],
        },
    ])('.unwrapKeyAsymmetrical($algorithm, $usages)', async ({algorithm, usages}): Promise<void> => {
        const keyAlgorithm: KeyAlgorithm = algorithm as KeyAlgorithm;
        const keyUsages: KeyUsage[] = usages as KeyUsage[];

        const key: CryptoKey = await crypto.generateKey(keyAlgorithm, true, keyUsages) as CryptoKey;

        const keyPair: CryptoKeyPair = await crypto.generateKey({
            name: 'RSA-OAEP',
            modulusLength: 4096,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: 'SHA-256',
        }, false, ['encrypt', 'decrypt']);

        const wrapped: ArrayBuffer = await Cryptography.wrapKeyAsymmetrical(key, keyPair.publicKey);

        const unwrapped: CryptoKey = await Cryptography.unwrapKeyAsymmetrical(
            wrapped,
            keyPair.privateKey,
            keyAlgorithm,
            true,
            keyUsages,
        );

        expect(unwrapped).toStrictEqual(key);
    });

    test('.unwrapKeyAsymmetrical() with non-asymmetrical key', async (): Promise<void> => {
        const key: CryptoKey = await crypto.generateKey({
            name: 'AES-GCM',
            length: 256,
        }, true, ['encrypt', 'decrypt']) as CryptoKey;

        await expect(async (): Promise<void> => {
            await Cryptography.unwrapKeyAsymmetrical(
                new ArrayBuffer(0),
                key,
                {} as KeyAlgorithm,
                true,
                [] as KeyUsage[],
            );
        }).rejects.toThrowError('Encryption key must be unwrapped using a public or private key.')
    });

    test.each([
        {
            algorithm: {
                name: 'RSA-OAEP',
                modulusLength: 4096,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: 'SHA-256',
            },
            expected: true,
        },
        {
            algorithm: {
                name: 'AES-GCM',
                length: 256,
            },
            expected: false,
        },
    ])('.isAsymmetricalKey($algorithm, $expected)', async ({algorithm, expected}): Promise<void> => {
        const key: any = await crypto.generateKey(algorithm, false, ['encrypt', 'decrypt']);

        if (
            'privateKey' in key
            && 'publicKey' in key
        ) {
            expect(Cryptography.isAsymmetricalKey(key.publicKey)).toStrictEqual(expected);
            expect(Cryptography.isAsymmetricalKey(key.privateKey)).toStrictEqual(expected);

            return;
        }

        expect(Cryptography.isAsymmetricalKey(key)).toStrictEqual(expected);
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
