# Secure Profile

This repository provides structures to work with encrypted profiles.


## Getting started

Get started quickly by following the instructions below.


### Installation

Use [NPM](https://www.npmjs.com/) to install this library into your project:

```shell
npm install --save @0to10/secure-profiles
```


### Create a profile

Below is an example of how to create a new profile, using the `ProfileFactory` class
and adding some data to it.

The `Profile` instance created by the `ProfileFactory` is a _roaming_ profile, meaning
that it is unencrypted and mutable. A roaming profile may only be used locally on an
authorised device, and must never leave that device in its unencrypted form.

```typescript
'use strict';

import {ProfileFactory, RoamingProfile} from '0to10/secure-profile';

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

import {EncryptedProfile, Profile, ProfileFactory} from '0to10/secure-profile';

const factory: ProfileFactory = new ProfileFactory();

const profile = factory.create();
// Modify the profile

const encryptedProfile: EncryptedProfile = profile.encrypt(
    profile.deriveMasterKey('MyS3cretPassw0rd!')
);

// Store the profile
```


## Contributing

This section contains information on how to contribute to this package.

### Publishing the package

Before attempting to publish the package, ensure that you have an `NPM_TOKEN` configured in your
environment, that is authorised to publish to the organisation.

```shell
npm publish --access public
```
