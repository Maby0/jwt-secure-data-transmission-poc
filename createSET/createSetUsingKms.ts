import { SetWrapper } from '../shared/types'
import { createEncodedPartialTokenComponents } from '../shared/utils'
import { generateTokenSignatureWithKms } from './generateTokenSignatureWithKms'

export const createSetUsingKms = async (numberOfSets: number) => {
	const setListObject = {
		sets: {},
		moreAvailable: false,
	} as SetWrapper

	const arrayOfPartialTokenComponents =
		createEncodedPartialTokenComponents(numberOfSets)

	await Promise.all(
		arrayOfPartialTokenComponents.map(async (encodedTokenComponents, i) => {
			encodedTokenComponents.signature =
				await generateTokenSignatureWithKms(encodedTokenComponents)

			setListObject.sets[`sqsMessageId${i}`] =
				encodedTokenComponents.header +
				'.' +
				encodedTokenComponents.payload +
				'.' +
				encodedTokenComponents.signature
		})
	)

	return setListObject
}
