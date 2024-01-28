import { JWSWrapper } from '../shared/types'
import { createJWSPayload } from '../shared/utils'
import { createJWEWithCrypto } from './usingCrypto/createJWE/createJWEWithCrypto'

export const createJWE = async (dataToSend: JWSWrapper) => {
	return await createJWEWithCrypto(dataToSend)
}
