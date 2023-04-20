require('dotenv').config()
import crypto from 'crypto'

const publicKey = process.env['PUBLIC_KEY'] ?? ''
const privateKey = process.env['PRIVATE_KEY'] ?? ''
// let text = ''
// for (let i = 0; i < 57; i++) {
// 	text += 'hello!'
// }
const text = 'hello this is text to encrypt'
const data = crypto.randomBytes(32)
console.log(text)
const encryptedText = crypto.publicEncrypt(
	{ key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
	// Buffer.from(text)
	data
)
const b64urlData = Buffer.from(encryptedText).toString('base64url')
console.log('encrypted text: ', b64urlData)

const decryptedText = crypto.privateDecrypt(
	{ key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING },
	Buffer.from(b64urlData, 'base64url')
)
console.log('decrypted text: ', Buffer.from(decryptedText).toString('ascii'))
