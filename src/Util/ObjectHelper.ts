'use strict';

/**
 * ObjectHelper
 *
 * @copyright Copyright (c) 2024 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class ObjectHelper {

    public static removeProperties(object: object, removeProperties: string[]): object {
        const newObject: object = {};

        for (const property in object) {
            if (removeProperties.includes(property)) {
                continue;
            }

            newObject[property] = object[property];
        }

        return newObject;
    }

    public static flatten(input: object): object {
        let result: Record<string, any> = {};

        for (const property in input) {
            if (!input.hasOwnProperty(property)) {
                continue;
            }

            const current: any = input[property];

            if ('object' !== typeof current) {
                result[property] = current;
                continue;
            }

            const flattened: Record<string, any> = ObjectHelper.flatten(current);
            for (const key in flattened) {
                if (!flattened.hasOwnProperty(key)) {
                    continue;
                }

                result[property + '.' + key] = flattened[key];
            }
        }

        return result;
    }

}
