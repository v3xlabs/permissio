<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./public/permissio_white.webp" />
    <img alt="permissio" src="./public/permissio_black.webp" width="400px" />
  </picture>
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
  - [fromBuffer](#frombuffer)
  - [toBitString](#tobitstring)
  - [toString](#tostring)
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

Using Permissio simplifies permission manipulation and storage through intelligent use of bitfields.

At its core you will be able to create an `enum` for your permissions, so long as the key of which is an integer.

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

Gathering wether permissiondata contains a certain permission is as easy as follows:

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

### fromBuffer

Likewise to [toPermissionsBuffer](#topermissionsbuffer) you can also get the permissiondata from a buffer:

```ts
const permissionData = fromBuffer(buffer);
```

### toBitString

Converting the permissiondata to bitstring is as easy as:

```ts
const bitstring = toBitString(permissionData);
```

### toString

Converting the permissiondata to string is as easy as:

```ts
const string = toString(permissionData);
```

## Contributors

[![](https://contrib.rocks/image?repo=lvkdotsh/permissio)](https://github.com/lvkdotsh/permissio/graphs/contributors)

## LICENSE

This package is licensed under the [GNU Lesser General Public License](https://www.gnu.org/licenses/lgpl-3.0).
