'use strict';

import {describe, expect, test} from '@jest/globals';

import {Data} from '../../src/Account/Data';


describe('Data', (): void => {

    const data: Data = new Data();

    test('.get() and .set()', async (): Promise<void> => {
        data.set('test', 'something');
        data.set('test.with.dots', 1234567890);
        data.set('with spaces', true);

        expect(data.get('test')).toStrictEqual('something');
        expect(data.get('test.with.dots')).toStrictEqual(1234567890);
        expect(data.get('with spaces')).toStrictEqual(true);
    });

});
