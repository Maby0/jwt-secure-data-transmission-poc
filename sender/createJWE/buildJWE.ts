import { JWSWrapper } from '../../shared/types'
import { serialiseJWESections } from '../../shared/utils'
import { createJWESections } from './createJWESections'

export const buildJWE = async (dataToSend: JWSWrapper) => {
	const jweSections = await createJWESections(dataToSend)
	const serialisedJWE = serialiseJWESections(jweSections)

	return serialisedJWE
}
