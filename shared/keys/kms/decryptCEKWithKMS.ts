import {
	KMSClient,
	DecryptCommandInput,
	DecryptCommand,
} from '@aws-sdk/client-kms'

export const decryptCEKWithKMS = async (encryptedCek: string) => {
	const client = new KMSClient({ region: process.env['AWS_REGION'] })
	const input: DecryptCommandInput = {
		CiphertextBlob: Buffer.from(encryptedCek, 'base64url'),
		EncryptionAlgorithm: 'RSAES_OAEP_SHA_256',
		KeyId: process.env['KEY_ENCRYPTION_KEY_ARN'],
	}
	const decryptCommand = new DecryptCommand(input)
	const result = await client.send(decryptCommand)

	if (!result.Plaintext) throw Error('Empty Plaintext property returned')

	return result.Plaintext
}
