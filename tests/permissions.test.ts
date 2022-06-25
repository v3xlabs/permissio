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
