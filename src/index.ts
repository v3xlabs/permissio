type PermissionData = bigint;
type Permissions = number;

export const EMPTY_PERMISSIONS = BigInt(0);
export const convertToBit = (b: number | bigint) => BigInt(1) << BigInt(b);
export const hasPermission = <K extends Permissions>(
    data: PermissionData,
    permission: K
) => (data & convertToBit(permission)) > 0;
export const grantPermission = <K extends Permissions>(
    data: PermissionData,
    ...permission: K[]
) =>
    permission.reduce(
        (previous, current) => previous | convertToBit(current),
        data
    );
export const removePermission = <K extends Permissions>(
    data: PermissionData,
    ...permission: K[]
) =>
    permission.reduce(
        (previous, current) => (previous &= ~convertToBit(current)),
        data
    );
const BIG_FF = BigInt(255);

export const toPermissionsBuffer = (data: PermissionData): Buffer => {
    const length = (data.toString(2).length >> 3) + 1;

    const arrayBuffer = new ArrayBuffer(Number(length));
    const view = new Int8Array(arrayBuffer);

    for (let index = 0; index < length; index++)
        view[index] = Number((data >> BigInt(index * 8)) & BIG_FF);

    return Buffer.from(arrayBuffer);
};
export const toBitString = (data: PermissionData) => data.toString(2);

export const generatePermissions = (root: bigint) => {
    return {
        has: (permission: Permissions) => hasPermission(root, permission),
        grant: (...permission: Permissions[]) => {
            root = grantPermission(root, ...permission);

            return root;
        },
        remove: (...permission: Permissions[]) => {
            root = removePermission(root, ...permission);

            return root;
        },
        toBuffer: () => toPermissionsBuffer(root),
        toBitString: () => toBitString(root),
        toString: () => root.toString(),
    };
};
