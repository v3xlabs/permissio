import { generatePermissions } from '.';

const { createNew, fromBuffer, fromBigint } = generatePermissions(
    'full_access',
    'app_read',
    'app_write',
    'app_delete',
    'domains_read',
    'domains_write',
    'domains_delete',
    'deployments_read',
    'deployments_write'
);

const user = createNew('app_read', 'app_delete');

// grant a permission
user.grant('full_access');
user.grant('domains_write');

// remove a permission
user.remove('app_read');

const buffer = user.toBuffer();
const bits = user.toBigint();

// a bunch of conversion
console.log(bits, user.toBitstring(), buffer, user.toHumanReadable());

const user2 = fromBuffer(buffer);

user2.grant('deployments_write');

console.log(
    user2.toBigint(),
    user2.toBitstring(),
    user2.toBuffer(),
    user2.toHumanReadable()
);

const user3 = fromBigint(bits);

user3.remove('app_delete');

console.log(
    user3.toBigint(),
    user3.toBitstring(),
    user3.toBuffer(),
    user3.toHumanReadable()
);
