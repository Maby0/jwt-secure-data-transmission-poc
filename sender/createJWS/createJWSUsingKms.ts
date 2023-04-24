import { JWSWrapper } from '../../shared/types'
import { createEncodedPartialTokenComponents } from '../../shared/utils'
import { generateTokenSignatureWithKms } from './generateTokenSignatureWithKms'

export const createJWSUsingKms = async (numberOfJWSToCreate: number) => {
	const jwsWrapper = {
		jwsList: {},
		moreAvailable: false,
	} as JWSWrapper

	const arrayOfPartialTokenComponents =
		createEncodedPartialTokenComponents(numberOfJWSToCreate)

	await Promise.all(
		arrayOfPartialTokenComponents.map(async (encodedTokenComponents, i) => {
			encodedTokenComponents.signature =
				await generateTokenSignatureWithKms(encodedTokenComponents)

			jwsWrapper.jwsList[`sqsMessageId${i}`] =
				encodedTokenComponents.header +
				'.' +
				encodedTokenComponents.payload +
				'.' +
				encodedTokenComponents.signature
		})
	)

	return jwsWrapper
}
