import fetch from 'node-fetch'
import crypto from 'crypto'

export const getRPPublicKeyAsKeyObject = async () => {
	const getKeysResponse = await fetch(
		'http://localhost:4000/getPublicKeyAsJwk'
	)
	const keySet = await getKeysResponse.json()
	return crypto.createPublicKey({ key: keySet.keys[0], format: 'jwk' })
}
