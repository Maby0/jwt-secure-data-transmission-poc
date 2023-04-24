import crypto from 'crypto'
import {
	DecryptCommand,
	DecryptCommandInput,
	KMSClient,
} from '@aws-sdk/client-kms'
import { JWESections } from '../../shared/types'
import { splitJWESections } from '../../shared/utils'

export const extractDataFromJWE = async (jweAsString: string) => {
	const jweSections = splitJWESections(jweAsString)
	jweSections.decryptedCek = (await decryptCEK(
		jweSections.encryptedCek
	)) as Uint8Array
	const decryptedData = decryptAndVerifyData(jweSections)

	const stringifiedData = Buffer.from(decryptedData).toString('utf8')
	return JSON.parse(stringifiedData)
}

const decryptCEK = async (encryptedCek: string) => {
	const client = new KMSClient({ region: process.env['AWS_REGION'] })
	const input: DecryptCommandInput = {
		CiphertextBlob: Buffer.from(encryptedCek, 'base64url'),
		EncryptionAlgorithm: 'RSAES_OAEP_SHA_256',
		KeyId: process.env['KEY_ENCRYPTION_KEY'],
	}
	const decryptCommand = new DecryptCommand(input)
	const result = await client.send(decryptCommand)

	if (!result.Plaintext) throw Error('Empty Plaintext property returned')

	return result.Plaintext
}

const decryptAndVerifyData = (jweSections: JWESections) => {
	const decipher = crypto.createDecipheriv(
		'aes-256-gcm',
		jweSections.decryptedCek as Uint8Array,
		Buffer.from(jweSections.iv, 'base64url')
	)
	decipher.setAuthTag(Buffer.from(jweSections.authTag, 'base64url'))

	return Buffer.concat([
		decipher.update(jweSections.cipherText, 'base64url'),
		decipher.final(),
	])
}