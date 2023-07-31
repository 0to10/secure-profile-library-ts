'use strict';

import {describe, expect, test} from '@jest/globals';

import {Cryptography} from '../src/Cryptography';
import {MasterKey} from '../src/MasterKey';

const encoder: TextEncoder = new TextEncoder();
const decoder: TextDecoder = new TextDecoder();
const crypto: SubtleCrypto = Cryptography.getEngine();


describe('MasterKey', (): void => {

    /**
     * Creates a predictable master key for testing purposes
     */
    const createMasterKey = async (): Promise<MasterKey> => {
        const algorithm: Pbkdf2Params = {
            name: 'PBKDF2',
            salt: Buffer.from('TST_ABC_DEF_123456'),
            iterations: 100000,
            hash: 'SHA-256',
        };

        const parameters: AesKeyGenParams = {name: 'AES-GCM', length: 256};
        const usages: Array<KeyUsage> = ['encrypt', 'decrypt'];

        const derivedData: CryptoKey = await crypto.deriveKey(
            algorithm,
            await crypto.importKey('raw', encoder.encode('TST_PASSWORD1234'), 'PBKDF2', false, [
                'deriveKey',
            ]),
            parameters,
            false,
            usages,
        );

        return new MasterKey(derivedData);
    }

    test('.encrypt()', async (): Promise<void> => {
        const masterKey: MasterKey = await createMasterKey();

        const data: ArrayBuffer = Buffer.from('some test string to encrypt and decrypt');

        const encrypted: ArrayBuffer = await masterKey.encrypt(data);

        expect(encrypted).toBeInstanceOf(Uint8Array);
        expect(encrypted.byteLength).toBeGreaterThan(100);

        expect(
            decoder.decode(await masterKey.decrypt(encrypted))
        ).toStrictEqual('some test string to encrypt and decrypt')
    });

    test('.decrypt()', async (): Promise<void> => {
        // Result of:
        // btoa(String.fromCharCode(...new Uint8Array(await masterKey.encrypt(data))))
        const encryptedData: string = 'AgAAngTYZVm9eVWOdZraZeL3url5dzUpkoodD1tw9oTlDoa7aayGTNKQI7wgmNwio4th6A6F4lKUzLVnfba00tXnXb7EfoYgOCBlCR/uwfIdEKcBnoX2aqaQU4Xma0YlzxkwBlVty99hjJSM0PXd29VwkllvJB5tu/nQI2WX3UI3NPl3uGTegA==';

        const buffer: Uint8Array = new Uint8Array(atob(encryptedData).split('').map((c: string): number => {
            return c.charCodeAt(0); }
        ));

        const masterKey: MasterKey = await createMasterKey();

        expect(
            decoder.decode(await masterKey.decrypt(buffer))
        ).toStrictEqual('this is a test string');
    });

});
