import crypto from 'crypto'
import { createJoseHeader } from '../../shared/utils'
import { JWSWrapper } from '../../shared/types'
import { getPublicKeyFromReceiver } from '../getPublicKeyFromReceiver'

export const createJWESections = async (dataToSend: JWSWrapper) => {
	const cipherCollection = createCipherCollection()

	const joseHeader = createJoseHeaderBuffer()
	const encryptedCek = await encryptCEKWithRPPublicKey(cipherCollection.cek)
	const cipherText = encryptDataIntoCipherText(
		cipherCollection.cipher,
		dataToSend
	)
	const authTag = cipherCollection.cipher.getAuthTag()

	return [joseHeader, encryptedCek, cipherCollection.iv, cipherText, authTag]
}

const createCipherCollection = () => {
	const cek = crypto.randomBytes(32)
	const iv = crypto.randomBytes(12)
	const cipher = crypto.createCipheriv('aes-256-gcm', cek, iv)

	return { cipher, cek, iv }
}

const createJoseHeaderBuffer = () => {
	const joseHeader = createJoseHeader()
	return Buffer.from(JSON.stringify(joseHeader))
}

const encryptDataIntoCipherText = (cipher: crypto.CipherGCM, data: unknown) => {
	if (typeof data !== 'string') data = JSON.stringify(data)
	return Buffer.concat([
		cipher.update(data as string, 'utf8'),
		cipher.final(),
	])
}

const encryptCEKWithRPPublicKey = async (cek: Buffer) => {
	const rpPublicKey = await getPublicKeyFromReceiver()
	return crypto.publicEncrypt(
		{
			key: rpPublicKey,
			padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
			oaepHash: 'sha256',
		},
		cek
	)
}
