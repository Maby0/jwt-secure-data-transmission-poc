import { JWSWrapper } from '../shared/types'
import { createJWEWithCrypto } from './usingCrypto/createJWE/createJWEWithCrypto'

export const createJWE = async (dataToSend: JWSWrapper) => {
	// if (process.env['USE_JOSE'] === 'true') {
	// 	return await createJWSJose(dataToSend)
	// }
	return await createJWEWithCrypto(dataToSend)
}
