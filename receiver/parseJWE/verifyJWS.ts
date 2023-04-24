import crypto from 'crypto'
import util from 'util'
import { SetWrapper } from '../../shared/types'
import { getPublicKeyFromSender } from '../getPublicKeyFromSender'

export const verifyJWSList = async (setWrapper: SetWrapper) => {
	const verificationKey = await getPublicKeyFromSender()
	const listOfBase64UrlSETs = Object.values(setWrapper.sets)
	listOfBase64UrlSETs.forEach((set) => {
		verifyJWS(set, verificationKey)
	})
}

const verifyJWS = (set: string, jwk: crypto.KeyObject) => {
	const [header, payload, signature] = set.split('.')
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

	if (!isVerified) throw Error('Previous logged SET not verified')
}
