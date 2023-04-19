export const createSetHeader = () => ({
	alg: 'RS256',
})

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

export type TokenComponents = {
	header: string
	payload: string
	signature: string
}

export type SetWrapper = {
	sets: {
		[key: string]: string
	}
	moreAvailable: boolean
}
