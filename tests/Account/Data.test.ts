'use strict';

import {describe, expect, test} from '@jest/globals';

import {Data} from '../../src/Account/Data';


describe('Data', (): void => {

    test('.get() and .set()', (): void => {
        const data: Data = new Data();

        data.set('test', 'something');
        data.set('test.with.dots', 1234567890);
        data.set('with spaces', true);

        expect(data.get('test')).toStrictEqual('something');
        expect(data.get('test.with.dots')).toStrictEqual(1234567890);
        expect(data.get('with spaces')).toStrictEqual(true);
    });

    test('.fromObject', (): void => {
        const data: Data = Data.fromObject({
            first: 'first',
            second: true,
            third: 12345,
        });

        expect(data).toBeInstanceOf(Data);
        expect(data.get('first')).toStrictEqual('first');
        expect(data.get('second')).toStrictEqual(true);
        expect(data.get('third')).toStrictEqual(12345);
    });

});
