require('dotenv').config()
import crypto from 'crypto'

const privateKey = process.env['PRIVATE_KEY'] ?? ''
const receivedJwe = process.env['JWE'] ?? ''
const [
	base64UrlJoseHeader,
	base64UrlEncryptedCek,
	base64UrlIv,
	base64UrlCipherText,
	base64UrlAuthTag,
] = receivedJwe.split('.')

const decryptedCek = crypto.privateDecrypt(
	privateKey,
	Buffer.from(base64UrlEncryptedCek, 'base64url')
)

console.log('before: ', base64UrlCipherText)

const decipher = crypto.createDecipheriv(
	'aes-256-gcm',
	decryptedCek,
	Buffer.from(base64UrlIv, 'base64url')
)

let decryptedData = decipher.update(
	Buffer.from(base64UrlCipherText, 'base64url')
)
const finalThing = Buffer.concat([decryptedData])
console.log('after: ', Buffer.from(finalThing).toString('ascii'))
