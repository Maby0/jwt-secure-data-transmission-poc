import { KMSClient, SignCommand } from '@aws-sdk/client-kms'

export const signDataWithKms = async (dataBuffer: Buffer) => {
	const client = new KMSClient({
		region: 'eu-west-2',
	})

	const command = new SignCommand({
		KeyId: process.env['JWS_SIGNING_KMS_KEY_ARN'],
		Message: dataBuffer,
		MessageType: 'RAW',
		SigningAlgorithm: 'RSASSA_PKCS1_V1_5_SHA_256',
	})

	const result = await client.send(command)
	return result
}
