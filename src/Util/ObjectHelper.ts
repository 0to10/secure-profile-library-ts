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

}
