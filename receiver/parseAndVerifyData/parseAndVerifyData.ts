import { extractDataFromJWE } from './usingCrypto/extractDataFromJWE'
import { verifyJWSList } from './usingCrypto/verifyJWSList'

export const parseAndVerifyData = async (jwe: string) => {
	// if (process.env['USE_JOSE'] === 'true') {
	// 	return await createJWSJose(dataToSend)
	// }
	const nestedJws = await extractDataFromJWE(jwe)
	return await verifyJWSList(nestedJws)
}
