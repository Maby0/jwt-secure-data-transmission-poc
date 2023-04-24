import { JWESections, TokenComponents } from './types'

export const uint8ArrayToBase64 = (uint8Array: Uint8Array) => {
	return Buffer.from(uint8Array).toString('base64')
}

export const createJWSHeader = () => ({ alg: 'RS256', typ: 'secevent+jwt' })

export const createJWSPayload = (jti: string) => ({
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
		const jwsHeader = toBase64Url(createJWSHeader())
		const jwsPayload = toBase64Url(createJWSPayload(`uniqueIdentifier${i}`))

		const encodedTokenComponents = {
			header: jwsHeader,
			payload: jwsPayload,
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
