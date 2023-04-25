import crypto from 'crypto'
import { JWESections } from '../../../shared/types'
import { splitJWESections } from '../../../shared/utils'
import { decryptCEKWithKMS } from '../../../shared/keys/kms/decryptCEKWithKMS'

export const extractDataFromJWE = async (jweAsString: string) => {
	const jweSections = splitJWESections(jweAsString)
	jweSections.decryptedCek = (await decryptCEKWithKMS(
		jweSections.encryptedCek
	)) as Uint8Array
	const decryptedData = decryptAndVerifyData(jweSections)

	const stringifiedData = Buffer.from(decryptedData).toString('utf8')
	return JSON.parse(stringifiedData)
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
