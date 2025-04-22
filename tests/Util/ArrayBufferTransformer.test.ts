'use strict';

import {describe, expect, test} from '@jest/globals';

import {ArrayBufferTransformer} from '../../src/Util/ArrayBufferTransformer';


describe('ArrayBufferTransformer', (): void => {

    const textEncoder: TextEncoder = new TextEncoder();

    test.each([
        {
            input: textEncoder.encode('test'),
            expected: 'dGVzdA==',
        },
        {
            input: textEncoder.encode('Hello, World!'),
            expected: 'SGVsbG8sIFdvcmxkIQ==',
        },
    ])('.toUint8Array($input, $expected)', ({
        input,
        expected,
    }): void => {
        const encoded: string = ArrayBufferTransformer.toBase64(input);

        expect(encoded).toStrictEqual(expected);
        expect(ArrayBufferTransformer.fromBase64(encoded)).toStrictEqual(input);
    });

});
