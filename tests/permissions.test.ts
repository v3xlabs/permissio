/* eslint-disable sonarjs/no-duplicate-string */
import { ExtractGeneric, generatePermissions, PermissionSet } from '../src';

it('exports', () => {
    expect(generatePermissions);
});

const permissions = generatePermissions(
    'generic-read',
    'generic-write',
    'generic-exec'
);

it('should create instance', () => {
    expect(permissions.createNew());
});

describe('instance methods', () => {
    let user: PermissionSet<ExtractGeneric<typeof permissions>>;

    beforeEach(() => {
        user = permissions.createNew('generic-read', 'generic-write');
    });

    describe('manipulating', () => {
        it('should contain "generic-read"', () => {
            expect(user.has('generic-read')).toBe(true);
        });

        it('should not contain "generic-exec"', () => {
            expect(user.has('generic-exec')).toBe(false);
        });

        it('should grant "generic-exec"', () => {
            user.grant('generic-exec');

            expect(user.has('generic-exec')).toBe(true);
        });

        it('should remove "generic-read"', () => {
            user.remove('generic-read');

            expect(user.has('generic-read')).toBe(false);
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
            expect(user.toBitstring()).toBe('11');
        });

        it('should export to human readable array of permission names', () => {
            expect(user.toHumanReadable()).toEqual([
                'generic-read',
                'generic-write',
            ]);
        });

        it('should have an overriden toString', () => {
            expect(user.toString()).toBe('3');
        });
    });
});

describe('mass testing', () => {
    const allPermissions = Array.from({ length: 1e4 })
        .fill(0)
        .map((_, index) => `${index}`);

    const massPermissions = generatePermissions(...allPermissions);

    it('can create a user with a lot of permissions', () => {
        const user = massPermissions.createNew(...allPermissions);

        expect(user.toBigint()).toBe(
            (BigInt(2) << BigInt(1e4 - 1)) - BigInt(1)
        );
    });
});

describe('generating from exported', () => {
    it('should generate from bigint', () => {
        const user = permissions.fromBigint(BigInt(0b100));

        expect(user.has('generic-read')).toBe(false);
        expect(user.has('generic-write')).toBe(false);
        expect(user.has('generic-exec')).toBe(true);
    });

    it('should generate from buffer', () => {
        const user = permissions.fromBuffer(Buffer.from([0x4]));

        expect(user.has('generic-read')).toBe(false);
        expect(user.has('generic-write')).toBe(false);
        expect(user.has('generic-exec')).toBe(true);
    });
});
