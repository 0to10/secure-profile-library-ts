'use strict';

import {describe, expect, test} from '@jest/globals';

import {Data} from '../../src/Account/Data';


describe('Data', (): void => {

    const data: Data = new Data();

    test('.get() and .set()', async (): Promise<void> => {
        data.set('test', 'something');

        expect(data.get('test')).toStrictEqual('something');
    });

});
