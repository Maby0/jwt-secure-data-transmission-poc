import { getPublicKeyFromEndpoint } from '../shared/keys/getPublicKeyFromEndpoint'

export const getPublicKeyFromSender = async () => {
	return getPublicKeyFromEndpoint(3000)
}
