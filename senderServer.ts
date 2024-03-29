require('dotenv').config()
import express, { Request, Response } from 'express'
import fetch from 'node-fetch'
import { createJwkFromRawPublicKey } from './shared/keys/generateJWKSObject'
import { getKmsPublicKey } from './shared/keys/kms/getKmsPublicKey'
import { createJWS } from './sender/createJWS'
import { createJWE } from './sender/createJWE'

const port = 3000
const app = express()
app.use(express.json())
app.use(express.text())

app.get('/getPublicKeyAsJwkFromAWS', async (req: Request, res: Response) => {
	const rawPublicKey = await getKmsPublicKey(
		process.env['JWS_SIGNING_KMS_KEY_ARN'] ?? ''
	)
	if (!rawPublicKey) throw Error('Could not find JWS signing KMS key')

	const jwk = createJwkFromRawPublicKey(rawPublicKey)

	res.json({
		keys: [jwk],
	})
})

app.listen(port, () => console.log('Port listening on: ', port))

setInterval(async () => {
	const jwsToSend = await createJWS()
	console.log(jwsToSend)
	const data = await createJWE(jwsToSend)

	const options = {
		method: 'POST',
		body: data,
	}

	console.log(options)
	console.log('Sending JWE to /relyingPartyReceiverEndpoint')
	const response = await fetch(
		'http://localhost:4000/relyingPartyReceiverEndpoint',
		options
	)
	console.log('Response from server: ', await response.text())
}, 10000)
