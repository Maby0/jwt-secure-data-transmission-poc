import crypto from 'crypto'
import { CompactEncrypt, SignJWT, compactDecrypt, compactVerify } from 'jose'
import { createJWSHeader, createJWSPayload } from './shared/utils'

const generateKeyPair = () => {
	const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
		modulusLength: 2048,
	})
	return { privateKey, publicKey }
}

// SENDER FUNCTIONS
const createJWS = async (privateKey: crypto.KeyObject) => {
	const jws = await new SignJWT(createJWSPayload('test'))
		.setProtectedHeader(createJWSHeader())
		.sign(privateKey)
	return jws
}

const createJWE = async (signedData: string, publicKey: crypto.KeyObject) => {
	const jwe = await new CompactEncrypt(Buffer.from(signedData))
		.setProtectedHeader({ alg: 'RSA-OAEP', enc: 'A256GCM' })
		.encrypt(publicKey)
	return jwe
}

// RECEIVER FUNCTIONS
const decryptJWE = async (jwe: string, privateKey: crypto.KeyObject) => {
	const data = await compactDecrypt(jwe, privateKey)
	return data
}

const verifyJWS = async (jws: Uint8Array, publicKey: crypto.KeyObject) => {
	return await compactVerify(jws, publicKey)
}

// SCRIPT
const senderAsymmetricKey = { ...generateKeyPair() }
const receiverAsymmmetricKey = { ...generateKeyPair() }

createJWS(senderAsymmetricKey.privateKey)
	.then((jws) => {
		console.log(
			"This is the JWS that the sender constructs containing the data meant for the receiver - the data is signed with the sender's private key: \n",
			jws
		)
		return createJWE(jws, receiverAsymmmetricKey.publicKey)
	})
	.then((jwe) => {
		console.log(
			"\nThis is the JWE that has the previous JWS as a payload - it is encrypted using the receiver's public key: \n",
			jwe
		)
		return decryptJWE(jwe, receiverAsymmmetricKey.privateKey)
	})
	.then((jws) => {
		console.log(
			'\nThe receiver receives the JWE and decrypts it using their private key.',
			'\nOnce the JWE is decrypted, this is the payload of the JWE which is the original JWS: \n',
			Buffer.from(jws.plaintext).toString('ascii')
		)
		return verifyJWS(jws.plaintext, senderAsymmetricKey.publicKey)
	})
	.then((data) => {
		console.log(
			"\nNon-repudiation of the JWS is then verified using the sender's public key.",
			"\nOnce it's been verified, the data can be decoded and used: \n",
			{
				protectedHeader: data.protectedHeader,
				payload: Buffer.from(data.payload).toString('ascii'),
			}
		)
	})
