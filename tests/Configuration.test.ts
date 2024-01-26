'use strict';

import {describe, expect, test} from '@jest/globals';

import {Configuration} from '../src/Configuration';


describe('Configuration', (): void => {

    test('.encryptionImportAlgorithm()', (): void => {
        expect(Configuration.encryptionImportAlgorithm).toMatchObject({
            name: 'RSA-OAEP',
            hash: 'SHA-256',
        });
    });

});
