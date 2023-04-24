import { getPublicKeyFromEndpoint } from '../shared/keys/getPublicKeyFromEndpoint'

export const getPublicKeyFromRelyingParty = async () => {
	return getPublicKeyFromEndpoint(4000)
}
