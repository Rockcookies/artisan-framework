import { EncryptionAlgorithm } from '../src';
import { getEncryptionProvider } from './utils';

describe('encrypter.test.ts', () => {
	const foo: EncryptionAlgorithm = {
		key: '99e851a30529050c2e5361bdf68cee4a',
		iv: 'b51c167451cf1ee0',
	};

	const bar: EncryptionAlgorithm = {
		key: '6239bb06d47a8144d6a748dfa3eb8ffe',
		iv: 'b2b6b26b60660443',
	};

	const another: EncryptionAlgorithm = {
		key: '6d86e08de9ad9d61b0e0f105811696d4',
		iv: 'e1f2153617bde998',
	};

	function decrypt(digest: Buffer | false): string | false {
		return digest === false ? digest : digest.toString('utf8');
	}

	it('should encrypt and decrypt success', async () => {
		const kgA = await getEncryptionProvider({ algorithms: [foo, bar] });
		const kgB = await getEncryptionProvider({ algorithms: [another, foo] });

		const encrypted = kgA.encrypt('hello');

		expect(decrypt(kgA.decrypt(encrypted))).toBe('hello');
		expect(decrypt(kgB.decrypt(encrypted))).toBe('hello');
	});

	it('should decrypt error return false', async () => {
		const kgA = await getEncryptionProvider({ algorithms: [foo, bar] });
		const kgB = await getEncryptionProvider({ algorithms: [another] });

		const encrypted = kgA.encrypt('hello');

		expect(decrypt(kgA.decrypt(encrypted))).toBe('hello');
		expect(decrypt(kgB.decrypt(encrypted))).toBe(false);
	});

	it('should signed and verify success', async () => {
		const kgA = await getEncryptionProvider({ algorithms: [foo, bar] });
		const kgB = await getEncryptionProvider({ algorithms: [another, foo] });

		const buf = Buffer.from('hello', 'utf8');
		const signed = kgA.sign(buf);

		expect(kgA.verify(buf, signed)).toBe(true);
		expect(kgB.verify(buf, signed)).toBe(true);
	});

	it('should signed and verify failed return false', async () => {
		const kgA = await getEncryptionProvider({ algorithms: [foo, bar] });
		const kgB = await getEncryptionProvider({ algorithms: [another] });

		const buf = Buffer.from('hello', 'utf8');
		const signed = kgA.sign(buf);

		expect(kgA.verify(buf, signed)).toBe(true);
		expect(kgB.verify(buf, signed)).toBe(false);
	});
});
