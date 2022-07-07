type PermissionData = bigint;
type Permissions = number;

export const EMPTY_PERMISSIONS = BigInt(0);
export const PermissionsToBit = (b: number | bigint) => BigInt(1) << BigInt(b);
export const hasPermission = <K extends Permissions>(
    data: PermissionData,
    permission: K
) => (data & PermissionsToBit(permission)) > 0;
export const grantPermission = <K extends Permissions>(
    data: PermissionData,
    ...permission: K[]
) => {
    for (const perm of permission) data |= PermissionsToBit(perm);

    return data;
};
export const removePermission = <K extends Permissions>(
    data: PermissionData,
    ...permission: K[]
) => {
    for (const perm of permission) data &= ~PermissionsToBit(perm);

    return data;
};
const BIG_FF = BigInt(255);

export const toPermissionsBuffer = (data: PermissionData): Buffer => {
    const length = (data.toString(2).length >> 3) + 1;

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

export const toPermissionsBitString = (data: PermissionData) => data.toString(2);

export const generatePermissions = (root: bigint) => {
    return {
        has: (permission: Permissions) => hasPermission(root, permission),
        grant: (...permission: Permissions[]) =>
            (root = grantPermission(root, ...permission)),
        remove: (...permission: Permissions[]) =>
            (root = removePermission(root, ...permission)),
        toBuffer: () => toPermissionsBuffer(root),
        toBitString: () => toPermissionsBitString(root),
        toString: () => root.toString(),
    };
};
