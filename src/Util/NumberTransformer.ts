'use strict';

/**
 * NumberTransformer
 *
 * @copyright Copyright (c) 2024 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class NumberTransformer {

    public static toUint8Array(input: number): Uint8Array {
        if (0 === input) {
            return new Uint8Array([0]);
        }

        let number: number = input;

        const length: number = Math.ceil(Math.log2(number) / 8);
        const result: Uint8Array = new Uint8Array(length);

        for (let i: number = 0; i < result.length; i++) {
            result[i] = number & 0xff;
            number = (number - result[i]) / 256;
        }

        return result;
    }

    public static fromUint8Array(input: Uint8Array): number {
        let result = 0;
        for (let i: number = input.length - 1; i >= 0; i--) {
            result = (result * 256) + input[i];
        }

        return result;
    }

}
