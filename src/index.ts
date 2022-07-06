type __ValueOfArray<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
    infer Type
>
    ? Type
    : never;

export type PermissionSet<T extends string[]> = {
    has(_: __ValueOfArray<T>): boolean;
    grant(_: __ValueOfArray<T>): void;
    remove(_: __ValueOfArray<T>): void;

    toHumanReadable(): __ValueOfArray<T>[]; // this will not require all values from original array
    toBigint(): bigint;
    toBuffer(): Buffer;
    toBitstring(): string;
    toString(): string;
};

type Permissions<T extends string[]> = Record<__ValueOfArray<T>, bigint>;

export type PermissionTools<T extends string[]> = {
    createNew(..._: __ValueOfArray<T>[]): PermissionSet<T>;
    fromBuffer(_: Buffer): PermissionSet<T>;
    fromBigint(_: bigint): PermissionSet<T>;
};

export type ExtractGeneric<T extends PermissionTools<any>> =
    T extends PermissionTools<infer S> ? S : never;

// idk, feels faster
const BIG_ONE = BigInt(1);
const BIG_FF = BigInt(255);

const bigintToBuffer = (bigint: bigint): Buffer => {
    const length = (bigint.toString(2).length >> 3) + 1;

    // realistically, length will never surpass the integer range
    const arrayBuffer = new ArrayBuffer(Number(length));
    const view = new Int8Array(arrayBuffer);

    for (let index = 0; index < length; index++)
        view[index] = Number((bigint >> BigInt(index * 8)) & BIG_FF);

    return Buffer.from(arrayBuffer);
};

// mhm yes, naming is definetely my strong suite
const permissionSetFromBitsAndPermissions = <T extends string[]>(
    permissionNames: T,
    permissions: Permissions<T>,
    bits: bigint
): PermissionSet<T> => {
    const has = (perm: __ValueOfArray<T>) => (bits & permissions[perm]) > 0;

    return {
        has,
        grant: (perm) => (bits |= permissions[perm]),
        remove: (perm) => (bits &= ~(permissions[perm] as bigint)),

        toHumanReadable: () =>
            permissionNames.filter((name) =>
                has(name as __ValueOfArray<T>)
            ) as __ValueOfArray<T>[],
        toBigint: () => bits,
        toBuffer: () => bigintToBuffer(bits),
        toBitstring: () => bits.toString(2),
        toString: () => bits.toString(),
    };
};

// do not bad
export const generatePermissions = <T extends string[]>(
    ...permissionNames: T
): PermissionTools<T> => {
    let bit = BigInt(0);
    const permissions: Permissions<T> = Object.assign(
        {},
        ...permissionNames.map((name) => ({ [name]: BIG_ONE << bit++ }))
    );

    const createNew = (...names: __ValueOfArray<T>[]): PermissionSet<T> => {
        let bits = BigInt(0);

        for (const name of names)
            bits |= permissions[name as __ValueOfArray<T>];

        return permissionSetFromBitsAndPermissions(
            permissionNames,
            permissions,
            bits
        );
    };

    const fromBuffer = (buffer: Buffer): PermissionSet<T> => {
        const view = new Uint8Array(buffer);

        let bits = BigInt(0);

        for (let index = 0; index < view.length; index++)
            bits |= BigInt(view[index]) << BigInt(index * 8);

        return permissionSetFromBitsAndPermissions(
            permissionNames,
            permissions,
            bits
        );
    };

    const fromBigint = (bigint: bigint): PermissionSet<T> =>
        permissionSetFromBitsAndPermissions(
            permissionNames,
            permissions,
            bigint
        );

    return { createNew, fromBuffer, fromBigint };
};
