require('dotenv').config()
import { GetPublicKeyCommand, KMSClient } from '@aws-sdk/client-kms'

export const getKmsPublicKey = async (keyArn: string) => {
	const client = new KMSClient({
		region: process.env['AWS_REGION'],
	})

	const getPublicKeyCommand = new GetPublicKeyCommand({
		KeyId: keyArn,
	})

	return (await client.send(getPublicKeyCommand)).PublicKey
}
