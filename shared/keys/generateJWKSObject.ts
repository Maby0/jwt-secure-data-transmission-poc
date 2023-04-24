import { createPublicKey } from 'crypto'
import { uint8ArrayToBase64 } from '../utils'

export const createJwkFromRawPublicKey = (rawPublicKey: Uint8Array) => {
	const stringPublicKey = uint8ArrayToBase64(rawPublicKey)

	const formattedPublicKey =
		'-----BEGIN PUBLIC KEY-----\n' +
		stringPublicKey +
		'\n-----END PUBLIC KEY-----'

	try {
		return createPublicKey(formattedPublicKey).export({
			format: 'jwk',
		})
	} catch (error) {
		throw Error(
			'Could not create Public Key. Imported key may be in an incorrect format'
		)
	}
}
