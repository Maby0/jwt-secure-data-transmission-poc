export type TokenComponents = {
	header: string
	payload: string
	signature: string
}

export type JWSWrapper = {
	jwsList: {
		[key: string]: string
	}
	moreAvailable: boolean
}

export interface JWESections {
	joseHeader: string
	encryptedCek: string
	decryptedCek?: Uint8Array
	iv: string
	cipherText: string
	authTag: string
}
