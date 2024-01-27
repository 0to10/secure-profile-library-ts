'use strict';

type Seed = {
    label: string;
    value: string;
};

/**
 * RandomStringGenerator
 *
 * Note that the generator allows for generated lengths that are less than the
 * number of seeds given. This is by design, and allows us to validate that each
 * generated string contains a character from all seeds.
 *
 * @copyright Copyright (c) 2023 0TO10 B.V. <https://0to10.nl>
 * @license MIT
 */
export class RandomStringGenerator {

    constructor(
        private readonly seeds: Seed[],
    ) {
    }

    public generate(length: number): string {
        let result: string = '';

        const seeds: string = this.seeds.map(seed => seed.value).join('');

        do {
            result += seeds.charAt(this.randomNumber(0, seeds.length));
        } while (result.length < length);

        return result;
    }

    private randomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

}
