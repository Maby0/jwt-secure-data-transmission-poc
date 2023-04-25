import { createJWSConcat } from './usingCrypto/createJWS/createJWSConcat'

export const createJWS = async () => {
	// if (process.env['USE_JOSE'] === 'true') {
	// 	return await createJWSJose()
	// }
	return await createJWSConcat(1)
}
