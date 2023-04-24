import crypto from 'crypto'
import util from 'util'
import { JWSWrapper } from '../../shared/types'
import { getPublicKeyFromSender } from '../getPublicKeyFromSender'

export const verifyJWSList = async (jwsWrapper: JWSWrapper) => {
	const verificationKey = await getPublicKeyFromSender()
	const base64UrlJWSList = Object.values(jwsWrapper.jwsList)
	base64UrlJWSList.forEach((jws) => {
		verifyJWS(jws, verificationKey)
	})
}

const verifyJWS = (jws: string, jwk: crypto.KeyObject) => {
	const [header, payload, signature] = jws.split('.')
	const decodedHeader = Buffer.from(header, 'base64url').toString('utf8')
	const decodedPayload = Buffer.from(payload, 'base64url').toString('utf8')
	const parsedHeader = JSON.parse(decodedHeader)
	const parsedPayload = JSON.parse(decodedPayload)

	const verifier = crypto.createVerify('RSA-SHA256')
	verifier.update(`${header}.${payload}`)
	const isVerified = verifier.verify(
		{ key: jwk, format: 'jwk' },
		signature,
		'base64url'
	)

	console.log(parsedHeader)
	console.log(util.inspect(parsedPayload, { depth: null }))

	if (!isVerified) throw Error('Previous logged JWS not verified')
}
