/* eslint-disable unused-imports/no-unused-vars */
import {
    containsPermissions,
    createPermissions,
    differencePermissions,
    EMPTY_PERMISSIONS,
    fromPermissionsBuffer,
    grantPermission,
    hasPermission,
    intersectionPermissions,
    PermissionCollection,
    PermissionData,
    removePermission,
    toPermissionsBitString,
    toPermissionsBuffer,
    unionPermissions,
} from '../src';

it('exports', () => {
    expect(hasPermission);
    expect(grantPermission);
    expect(removePermission);
    expect(toPermissionsBuffer);
    expect(unionPermissions);
    expect(intersectionPermissions);
    expect(differencePermissions);
    expect(containsPermissions);
    expect(toPermissionsBitString);
    expect(fromPermissionsBuffer);
    expect(createPermissions);
});

enum Permissions {
    READ,
    WRITE,
    EXEC,
}

describe('basic functions', () => {
    let user: PermissionData;
    let secondUser: PermissionData;
    let bigUser: PermissionData;
    let antony: PermissionData;

    beforeEach(() => {
        user = grantPermission(
            EMPTY_PERMISSIONS,
            Permissions.READ,
            Permissions.WRITE
        );

        secondUser = grantPermission(
            EMPTY_PERMISSIONS,
            Permissions.WRITE,
            Permissions.EXEC
        );

        bigUser = grantPermission(EMPTY_PERMISSIONS, 1024);
        antony = grantPermission(EMPTY_PERMISSIONS, 1_048_576);
    });

    describe('manipulating', () => {
        it('should contain "READ"', () => {
            expect(hasPermission(user, Permissions.READ)).toBe(true);
        });

        it('should not contain "EXEC"', () => {
            expect(hasPermission(user, Permissions.EXEC)).toBe(false);
        });

        it('should grant "EXEC"', () => {
            user = grantPermission(user, Permissions.EXEC);

            expect(hasPermission(user, Permissions.EXEC)).toBe(true);
        });

        it('should remove "READ"', () => {
            user = removePermission(user, Permissions.READ);

            expect(hasPermission(user, Permissions.READ)).toBe(false);
        });
    });

    describe('combinations', () => {
        it('should contain union', () => {
            const unionUser = unionPermissions(user, secondUser);

            expect(hasPermission(unionUser, Permissions.READ)).toBe(true);
            expect(hasPermission(unionUser, Permissions.WRITE)).toBe(true);
            expect(hasPermission(unionUser, Permissions.EXEC)).toBe(true);
        });

        it('should contain intersection', () => {
            const intersectionUser = intersectionPermissions(user, secondUser);

            expect(hasPermission(intersectionUser, Permissions.READ)).toBe(
                false
            );
            expect(hasPermission(intersectionUser, Permissions.WRITE)).toBe(
                true
            );
            expect(hasPermission(intersectionUser, Permissions.EXEC)).toBe(
                false
            );
        });

        it('should contain difference', () => {
            const differenceUser = differencePermissions(user, secondUser);

            expect(hasPermission(differenceUser, Permissions.READ)).toBe(true);
            expect(hasPermission(differenceUser, Permissions.WRITE)).toBe(
                false
            );
            expect(hasPermission(differenceUser, Permissions.EXEC)).toBe(false);
        });

        it('should contain', () => {
            user = grantPermission(user, Permissions.EXEC);

            expect(containsPermissions(user, secondUser)).toBe(true);
        });

        it('should not contain', () => {
            expect(containsPermissions(user, secondUser)).toBe(false);
        });
    });

    describe('exporting', () => {
        it('should export to Buffer', () => {
            expect(
                Buffer.compare(toPermissionsBuffer(user), Buffer.from([0x3]))
            ).toBe(0);
        });

        it('should export to Buffer (1024 permissions)', () => {
            expect(
                Buffer.compare(
                    toPermissionsBuffer(bigUser),
                    Buffer.from([
                        ...(Array.from({ length: 128 }).fill(0) as number[]),
                        1,
                    ])
                )
            ).toBe(0);
        });

        it('should export to Buffer (2**30 permissions)', () => {
            expect(
                Buffer.compare(
                    toPermissionsBuffer(antony),
                    Buffer.from([
                        ...(Array.from({ length: 131_072 }).fill(
                            0
                        ) as number[]),
                        1,
                    ])
                )
            ).toBe(0);
        });

        it('should export to bitstring', () => {
            expect(toPermissionsBitString(user)).toBe('11');
        });

        it('should have an overriden toString', () => {
            expect(user.toString()).toBe('3');
        });
    });
});

describe('generating from exported', () => {
    it('should generate from bigint', () => {
        const user = grantPermission(BigInt(0b100));

        expect(hasPermission(user, Permissions.READ)).toBe(false);
        expect(hasPermission(user, Permissions.WRITE)).toBe(false);
        expect(hasPermission(user, Permissions.EXEC)).toBe(true);
    });

    it('should generate from buffer', () => {
        const user = fromPermissionsBuffer(Buffer.from([0x4]));

        expect(hasPermission(user, Permissions.READ)).toBe(false);
        expect(hasPermission(user, Permissions.WRITE)).toBe(false);
        expect(hasPermission(user, Permissions.EXEC)).toBe(true);
    });
});

describe('mass testing', () => {
    const allPermissions = Array.from({ length: 1e4 })
        .fill(0)
        .map((_, index) => index);

    it('can create a user with a lot of permissions', () => {
        const user = grantPermission(EMPTY_PERMISSIONS, ...allPermissions);

        expect(user).toBe((BigInt(2) << BigInt(1e4 - 1)) - BigInt(1));
    });
});

describe('non tree-shakeable testing', () => {
    let user: PermissionCollection;

    beforeEach(() => {
        user = createPermissions();
        user.grant(Permissions.READ);
        user.grant(Permissions.WRITE);
    });

    describe('manipulating', () => {
        it('should contain "READ"', () => {
            expect(user.has(Permissions.READ)).toBe(true);
        });

        it('should not contain "EXEC"', () => {
            expect(user.has(Permissions.EXEC)).toBe(false);
        });

        it('should grant "EXEC"', () => {
            user.grant(Permissions.EXEC);

            expect(user.has(Permissions.EXEC)).toBe(true);
        });

        it('should remove "READ"', () => {
            user.remove(Permissions.READ);

            expect(user.has(Permissions.READ)).toBe(false);
        });
    });

    describe('exporting', () => {
        it('should export to bigint', () => {
            expect(user.toBigint()).toBe(BigInt(0b11));
        });

        it('should export to Buffer', () => {
            expect(Buffer.compare(user.toBuffer(), Buffer.from([0x3]))).toBe(0);
        });

        it('should export to bitstring', () => {
            expect(user.toBitString()).toBe('11');
        });

        it('should have an overriden toString', () => {
            expect(user.toString()).toBe('3');
        });
    });
});
