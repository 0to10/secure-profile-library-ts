'use strict';

export {Configuration} from './Configuration';

import {Cryptography} from './Cryptography';

class BcCryptography extends Cryptography {
    public static override randomBytes(length: number): Uint8Array {
        return new Uint8Array(super.randomBytes(length));
    }
}

export {BcCryptography as Cryptography};

export {ArrayBufferTransformer} from './Util/ArrayBufferTransformer';
export {CryptoParameters} from './CryptoParameters.type';
export {CryptoVersions} from './CryptoVersions';
export {Data} from './Account/Data';
export {EncryptedProfile} from './Account/Profile/EncryptedProfile';
export {EncryptionResult} from './EncryptionResult.type';
export {MasterKey} from './MasterKey';
export {Profile} from './Account/Profile/Profile';
export {ProfileFactory} from './Account/Profile/ProfileFactory';
export {ProfileSerializer} from './Account/Profile/ProfileSerializer';
export {RandomStringGenerator} from './RandomStringGenerator';
export {RoamingProfile} from './Account/Profile/RoamingProfile';
export {Sealable} from './Sealable';
export {Unsealable} from './Unsealable';
