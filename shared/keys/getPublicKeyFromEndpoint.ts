import fetch from 'node-fetch'
import crypto from 'crypto'

export const getPublicKeyFromEndpoint = async (port: number) => {
	const getKeysResponse = await fetch(
		`http://localhost:${port}/getPublicKeyAsJwkFromAWS`
	)
	const keyList = await getKeysResponse.json()
	return crypto.createPublicKey({ key: keyList.keys[0], format: 'jwk' })
}
