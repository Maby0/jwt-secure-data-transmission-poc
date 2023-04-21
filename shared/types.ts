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

export interface JWESections {
	joseHeader: string
	encryptedCek: string
	decryptedCek?: Uint8Array
	iv: string
	cipherText: string
	authTag: string
}
