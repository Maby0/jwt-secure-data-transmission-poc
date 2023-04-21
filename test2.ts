require('dotenv').config()
import crypto from 'crypto'
import {
	KMSClient,
	DecryptCommandInput,
	DecryptCommand,
	EncryptCommandInput,
	EncryptCommand,
} from '@aws-sdk/client-kms'
import { getRPPublicKeyAsKeyObject } from './keys/getRPPublicKey'

const encryptCekWithRPPublicKey = async (cek: Buffer) => {
	const rpPublicKey = await getRPPublicKeyAsKeyObject()
	return crypto.publicEncrypt(
		{
			key: rpPublicKey,
			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
			oaepHash: 'sha256',
		},
		cek
	)
}

const encryptCekWithKMSDirectly = async (cek: Buffer) => {
	const client = new KMSClient({ region: process.env['AWS_REGION'] })
	const input: EncryptCommandInput = {
		Plaintext: cek,
		EncryptionAlgorithm: 'RSAES_OAEP_SHA_256',
		KeyId: process.env['KEY_ENCRYPTION_KEY'],
	}
	const encryptCommand = new EncryptCommand(input)
	const result = await client.send(encryptCommand)
	return result.CiphertextBlob
}

const decryptCekWithPrivateKey = async (cek: Buffer) => {
	const privateKey = process.env['PRIVATE_KEY'] ?? ''
	return crypto.privateDecrypt(crypto.createPrivateKey(privateKey), cek)
}

const decryptCekWithKMSDirectly = async (encryptedCek: Uint8Array) => {
	const client = new KMSClient({ region: process.env['AWS_REGION'] })
	const input: DecryptCommandInput = {
		CiphertextBlob: encryptedCek,
		EncryptionAlgorithm: 'RSAES_OAEP_SHA_256',
		KeyId: process.env['KEY_ENCRYPTION_KEY'],
	}
	const decryptCommand = new DecryptCommand(input)
	const result = await client.send(decryptCommand)
	return result
}

const test = async () => {
	const cek = crypto.randomBytes(32)
	console.log(Buffer.from(cek).toString('base64'))
	// const cek = 'asdfasdfadf'

	const encryptedCek = await encryptCekWithRPPublicKey(cek)
	// const encryptedCek = await encryptCekWithRPPublicKey(
	// 	Buffer.from(cek, 'ascii')
	// )
	// const encryptedCek = await encryptCekWithKMSDirectly(cek)
	// const encryptedCek2 = await encryptCekWithKMSDirectly(cek)

	// const decryptedCek = await (
	// 	await decryptCekWithPrivateKey(encryptedCek)
	// ).toString('ascii')
	const decryptedCek = await decryptCekWithKMSDirectly(
		new Uint8Array(encryptedCek!)
	)

	console.log(Buffer.from(decryptedCek.Plaintext!).toString('base64'))
	// console.log(cek === decryptedCek)
	// console.log(decryptedCek)
}

test()
