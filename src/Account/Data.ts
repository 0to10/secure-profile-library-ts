'use strict';

/**
 * Data
 *
 * @copyright Copyright (c) 2024 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class Data<Allowed> {

    public get<T extends Allowed>(name: string): T | undefined {
        return this[name] ?? undefined;
    }

    public set<T extends Allowed>(name: string, value: T): void {
        this[name] = value;
    }

}
