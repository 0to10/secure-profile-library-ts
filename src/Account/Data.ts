'use strict';

/**
 * Data
 *
 * @copyright Copyright (c) 2024 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class Data {

    public static fromObject(object: object): Data {
        const data: Data = new Data();

        for (const key in object) {
            data.set(key, object[key]);
        }

        return data;
    }

    public get(name: string): any | undefined {
        return this[name] ?? undefined;
    }

    public set(name: string, value: any): void {
        this[name] = value;
    }

}
