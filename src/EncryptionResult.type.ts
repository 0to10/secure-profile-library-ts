'use strict';

/**
 * EncryptionResult
 *
 * @copyright Copyright (c) 2025 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export type EncryptionResult = {
    readonly iv: ArrayBuffer;
    readonly data: ArrayBuffer;
}
