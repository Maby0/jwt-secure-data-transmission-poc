import { getPublicKeyFromEndpoint } from '../shared/keys/getPublicKeyFromEndpoint'

export const getPublicKeyFromReceiver = async () => {
	return getPublicKeyFromEndpoint(4000)
}
