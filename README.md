<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./public/permissio_white.webp" />
    <img alt="permissio" src="./public/permissio_black.webp" width="400px" />
  </picture>
</p>

<p align="center">
<img src="https://img.shields.io/bundlephobia/min/permissio.svg" />
<img src="https://img.shields.io/badge/coverage-100%25-brightgreen.svg" />
<img src="https://img.shields.io/github/languages/top/lvkdotsh/permissio" />
<img src="https://img.shields.io/badge/dependencies-0-brightgreen.svg" />
<img src="https://img.shields.io/npm/dt/permissio" />
</p>

---

A simplified general-purpose permissions system for node apps.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
- [Documentation](#documentation)
  - [hasPermission](#haspermission)
  - [grantPermission](#grantpermission)
  - [removePermission](#removepermission)
  - [toPermissionsBuffer](#topermissionsbuffer)
  - [fromPermissionsBuffer](#frompermissionsbuffer)
  - [toPermissionsBitString](#topermissionsbitstring)
  - [toString](#tostring)
  - [createPermissions](#createpermissions)
- [Contributors](#contributors)
- [LICENSE](#license)

## Installation

Using `npm`:

```sh
npm install permissio
```

or if you prefer to use the `yarn` package manager:

```sh
yarn add permissio
```

or if you prefer to use the `pnpm` package manager:

```sh
pnpm add permissio
```

## Usage

Using Permissio simplifies permission manipulation and storage through the intelligent use of bitfields.

At its core, you will be able to create an `enum` for your permissions, so long as the value of which is an integer.

Next, one can call any of the functions involved.

```ts
import { hasPermission, grantPermission, EMPTY_PERMISSIONS } from 'permissio';

enum Permissions {
    CREATE,
    DELETE,
    LIST,
    USER_CREATE,
}

const steve = grantPermission(
    EMPTY_PERMISSIONS,
    Permissions.CREATE,
    Permissions.DELETE,
    Permissions.LIST
);

console.log(hasPermission(steve, Permissions.CREATE)); // true
console.log(hasPermission(steve, Permissions.DELETE)); // true
console.log(hasPermission(steve, Permissions.LIST)); // true
console.log(hasPermission(steve, Permissions.DELETE)); // true
console.log(hasPermission(steve, Permissions.USER_CREATE)); // false
```

## Documentation

### hasPermission

Gathering whether permissiondata contains a certain permission is as easy as follows:

```ts
hasPermission(steve, Permissions.USER_CREATE);
```

### grantPermission

When you want to add a permission to permissiondata you can do that like so:

```ts
const permissionData = grantPermission(permissionData, Permissions.CREATE);
```

The above code adds the `Permissions.CREATE` permission to the `permissionData`.

### removePermission

When you want to remove a permission from permissiondata you can do that like so:

```ts
const permissionData = removePermission(permissionData, Permissions.CREATE);
```

The above code removes the `Permissions.CREATE` permission from the `permissionData`.

### toPermissionsBuffer

When you want to convert your permission to a buffer you can do that as follows:

```ts
const buffer = toPermissionsBuffer(permissionData);
```

### fromPermissionsBuffer

Likewise to [toPermissionsBuffer](#topermissionsbuffer) you can also get the permissiondata from a buffer:

```ts
const permissionData = fromPermissionsBuffer(buffer);
```

### toPermissionsBitString

Converting the permissiondata to bitstring is as easy as:

```ts
const bitstring = toPermissionsBitString(permissionData);
```

### toString

Since permissionData is simply a BigInt, you can convert it to a string like so:

```ts
const string = permissionData.toString();
```

## Contributors

[![](https://contrib.rocks/image?repo=lvkdotsh/permissio)](https://github.com/lvkdotsh/permissio/graphs/contributors)

## LICENSE

This package is licensed under the [GNU Lesser General Public License](https://www.gnu.org/licenses/lgpl-3.0).
