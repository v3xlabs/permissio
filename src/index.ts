export type PermissionData = bigint;
type Permissions = number;

export const EMPTY_PERMISSIONS = BigInt(0);
export const permissionsToBit = (b: number | bigint) => BigInt(1) << BigInt(b);
export const hasPermission = <K extends Permissions>(
    data: PermissionData,
    permission: K
) => (data & permissionsToBit(permission)) > 0;
export const grantPermission = <K extends Permissions>(
    data: PermissionData,
    ...permission: K[]
) => {
    for (const perm of permission) data |= permissionsToBit(perm);

    return data;
};
export const removePermission = <K extends Permissions>(
    data: PermissionData,
    ...permission: K[]
) => {
    for (const perm of permission) data &= ~permissionsToBit(perm);

    return data;
};
const BIG_FF = BigInt(255);
const BS_CUTOFF = BigInt(2) << BigInt(512);
const HIGH_CUTOFF = BigInt(2) << (BigInt(2) << BigInt(15));

const highestBitIndex = (x: bigint) => {
    // toString, although being O(n), is faster for < ~512 permissions
    if (x < BS_CUTOFF) return x.toString(2).length;

    let low = 0;
    // slight performance optimization, will use a smaller high for < 2^15 permissions
    let high = x > HIGH_CUTOFF ? Number.MAX_SAFE_INTEGER : 2 << 16;

    while (low < high) {
        const mid = Math.floor((high + low) / 2);

        if (x >> BigInt(mid) > 0) {
            low = mid + 1;
        } else {
            high = mid;
        }
    }

    return high;
};

export const toPermissionsBuffer = (data: PermissionData): Buffer => {
    const length = (highestBitIndex(data) >> 3) + 1;

    const arrayBuffer = new ArrayBuffer(Number(length));
    const view = new Int8Array(arrayBuffer);

    for (let index = 0; index < length; index++)
        view[index] = Number((data >> BigInt(index * 8)) & BIG_FF);

    return Buffer.from(arrayBuffer);
};

export const fromPermissionsBuffer = (buffer: Buffer) => {
    const view = new Uint8Array(buffer);

    let bits = BigInt(0);

    for (let index = 0; index < view.length; index++)
        bits |= BigInt(view[index]) << BigInt(index * 8);

    return bits;
};

export const toPermissionsBitString = (data: PermissionData) =>
    data.toString(2);

export const createPermissions = <K extends Permissions>(
    root: PermissionData = EMPTY_PERMISSIONS,
    ...permission: K[]
) => {
    root = grantPermission(root, ...permission);

    return {
        has: (permission: Permissions) => hasPermission(root, permission),
        grant: (...permission: Permissions[]) =>
            (root = grantPermission(root, ...permission)),
        remove: (...permission: Permissions[]) =>
            (root = removePermission(root, ...permission)),
        toBigint: () => root,
        toBuffer: () => toPermissionsBuffer(root),
        toBitString: () => toPermissionsBitString(root),
        toString: () => root.toString(),
    };
};

export type PermissionCollection = ReturnType<typeof createPermissions>;
