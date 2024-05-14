# Secure Profile

This repository provides structures to work with encrypted profiles.


## Getting started

Get started quickly by following the instructions below.


### Installation

Use [NPM](https://www.npmjs.com/) to install this library into your project:

```shell
npm install --save @0to10/secure-profiles
```


### Configuration

> All configuration must be done before using any other structures provided by this package, or
> risk ending with an unstable state and/or corrupted data.

Configure the available cryptography parameters. Example below:

```typescript
import {CryptoVersions} from '@0to10/secure-profiles';

CryptoVersions.configure([
    {
        number: 1,
        algorithm: {
            name: 'AES-CTR',
            iv_length: 64,
        },
    },
]);
```


### Create a profile

Below is an example of how to create a new profile, using the `ProfileFactory` class
and adding some data to it.

The `Profile` instance created by the `ProfileFactory` is a _roaming_ profile, meaning
that it is unencrypted and mutable. A roaming profile may only be used locally on an
authorised device, and must never leave that device in its unencrypted form.

```typescript
'use strict';

import {ProfileFactory, RoamingProfile} from '@0to10/secure-profiles';

const factory: ProfileFactory = new ProfileFactory();

const profile: RoamingProfile = factory.create();
profile.data.set('sensitive_information', 'I am using a Qwerty keyboard.');
```

Any required authentication information should be stored outside the profile, as this
information is not accessible until the profile is decrypted.


### Encrypt a profile

Before transporting the profile, it must be encrypted. Classes that transport or store
a profile instance **must** refuse storing any unsealed profiles.

```typescript
'use strict';

import {EncryptedProfile, Profile, ProfileFactory} from '@0to10/secure-profiles';

const factory: ProfileFactory = new ProfileFactory();

const profile = factory.create();
// Modify the profile

const encryptedProfile: EncryptedProfile = profile.encrypt(
    await profile.deriveMasterKey('MyS3cretPassw0rd!')
);

// Store the profile
```


### Running in browser

When running in a web browser, use the library as bound to the `window` object under the
`SecureProfiles` index. Example below.

```js
const profileFactory = new window.SecureProfiles.ProfileFactory();

profileFactory.create().then(profile => {
    // Use "profile"
});
```