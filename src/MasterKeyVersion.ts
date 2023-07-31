'use strict';

/**
 * MasterKeyVersion
 *
 * @copyright Copyright (c) 2023 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export type MasterKeyVersion = {
    number: number;
    algorithm: {
        name: string;
        iv_length: number;
    };
}
