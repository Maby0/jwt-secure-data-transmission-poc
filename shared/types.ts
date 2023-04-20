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
