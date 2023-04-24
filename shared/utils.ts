import { JWESections, TokenComponents } from './types'

export const uint8ArrayToBase64 = (uint8Array: Uint8Array) => {
	return Buffer.from(uint8Array).toString('base64')
}

export const createSetHeader = () => ({ alg: 'RS256', typ: 'secevent+jwt' })

export const createSetPayload = (jti: string) => ({
	iss: 'https://issuer.digitalIdentity.gov/',
	jti: Buffer.from(jti, 'ascii').toString('hex'),
	iat: 1520364019,
	aud: 'https://audience.hmrc.gov/',
	events: {
		'https://schemas.digitalIdentity.gov/secevent/risc/event-type/ipv-spot-request-recieved':
			{
				subject: {
					format: 'iss_sub',
					iss: 'https://issuer.digitalIdentity.gov/',
					sub: 'aPairwiseId',
				},
			},
	},
})

export const createJoseHeader = () => ({ alg: 'RSA-OAEP', enc: 'A256GCM' })

export const createEncodedPartialTokenComponents = (n: number) => {
	const arrayOfPartialTokenComponents = [] as TokenComponents[]

	for (let i = 0; i < n; i++) {
		const setHeader = toBase64Url(createSetHeader())
		const setPayload = toBase64Url(createSetPayload(`uniqueIdentifier${i}`))

		const encodedTokenComponents = {
			header: setHeader,
			payload: setPayload,
		} as TokenComponents

		arrayOfPartialTokenComponents.push(encodedTokenComponents)
	}
	return arrayOfPartialTokenComponents
}

export const toBase64Url = (data: any) => {
	if (typeof data !== 'string') data = JSON.stringify(data)
	return Buffer.from(data).toString('base64url')
}

export const serialiseJWESections = (sections: Buffer[]) => {
	return sections
		.map((section) => Buffer.from(section).toString('base64url'))
		.join('.')
}

export const splitJWESections = (jweAsString: string): JWESections => {
	const jweSectionList = jweAsString.split('.')
	return {
		joseHeader: jweSectionList[0],
		encryptedCek: jweSectionList[1],
		iv: jweSectionList[2],
		cipherText: jweSectionList[3],
		authTag: jweSectionList[4],
	}
}
