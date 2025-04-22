'use strict';

/**
 * ArrayBufferTransformer
 *
 * @copyright Copyright (c) 2025 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class ArrayBufferTransformer {

    public static toBase64(buffer: ArrayBuffer): string {
        const array: Uint8Array = new Uint8Array(buffer);

        let result: string = '';
        for (let i: number = 0; i < array.byteLength; i++) {
            result += String.fromCharCode(array[i]);
        }

        return btoa(result);
    }

    public static fromBase64(data: string): ArrayBuffer {
        return new Uint8Array([...atob(data)].map((char: string): number => {
            return char.charCodeAt(0);
        }));
    }

}
