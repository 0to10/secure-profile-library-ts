'use strict';

import {ObjectHelper} from '../Util/ObjectHelper';

/**
 * Data
 *
 * @copyright Copyright (c) 2024 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class Data {

    public static fromObject(object: object): Data {
        const data: Data = new Data();

        const flattened: object = ObjectHelper.flatten(object);

        for (const key in flattened) {
            data.set(key, flattened[key]);
        }

        return data;
    }

    public get(name: string): any | undefined {
        return this[name] ?? undefined;
    }

    public has(name: string): boolean {
        return Object.prototype.hasOwnProperty.call(this, name);
    }

    public set(name: string, value: any): void {
        this[name] = value;
    }

}
