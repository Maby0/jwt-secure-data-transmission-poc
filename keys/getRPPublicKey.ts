import fetch from 'node-fetch'
import crypto from 'crypto'

export const getRPPublicKeyAsKeyObject = async (port: number) => {
	const getKeysResponse = await fetch(
		`http://localhost:${port}/getPublicKeyAsJwkFromAWS`
	)
	const keySet = await getKeysResponse.json()
	return crypto.createPublicKey({ key: keySet.keys[0], format: 'jwk' })
}
