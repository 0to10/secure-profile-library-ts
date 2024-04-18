'use strict';

/**
 * Sealable
 *
 * @copyright Copyright (c) 2024 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export interface Sealable<T> {
    seal(publicKey: CryptoKey): Promise<T>;
}
