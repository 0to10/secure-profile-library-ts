'use strict';

/**
 * KeyDerivationOptions
 *
 * @copyright Copyright (c) 2025 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export type KeyDerivationOptions = {
    /**
     * CPU/memory cost; increasing this increases the overall difficulty
     */
    readonly N: number;

    /**
     * Block size; increasing this increases the dependency on memory latency and bandwidth
     */
    readonly r: number;

    /**
     * Parallelization cost; increasing this increases the dependency on multiprocessing
     */
    readonly p: number;
}
