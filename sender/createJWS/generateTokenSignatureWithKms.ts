import { signDataWithKms } from '../../shared/keys/kms/signDataWithKms'

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
