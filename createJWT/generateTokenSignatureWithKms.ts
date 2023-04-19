import { KMSClient, SignCommand } from '@aws-sdk/client-kms'

export const generateTokenSignatureWithKms = async (encodedTokenComponents: {
	header: string
	payload: string
}) => {
	const encodedTokenComponentsBuffer = Buffer.from(
		encodedTokenComponents.header + '.' + encodedTokenComponents.payload
	)

	const { Signature } = await signDataWithKms(encodedTokenComponentsBuffer)

	const formattedSignature = Buffer.from(Signature as Uint8Array).toString(
		'base64url'
	)

	return formattedSignature
}

const signDataWithKms = async (dataBuffer: Buffer) => {
	const client = new KMSClient({
		region: 'eu-west-2',
	})

	const command = new SignCommand({
		KeyId: 'arn:aws:kms:eu-west-2:725018305812:key/b1b6ad0b-33dd-4525-8450-cd6b5fede947',
		Message: dataBuffer,
		MessageType: 'RAW',
		SigningAlgorithm: 'RSASSA_PKCS1_V1_5_SHA_256',
	})

	const result = await client.send(command)
	return result
}
