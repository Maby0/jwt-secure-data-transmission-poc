require('dotenv').config()
import express, { Request, Response } from 'express'
import { createJwkFromRawPublicKey } from './keys/generateJWKSObject'
import { getKmsPublicKey } from './keys/getKmsPublicKey'
import fetch from 'node-fetch'
import { createSetUsingKms } from './createSET/createSetUsingKms'
import { buildJWE } from './createJWE/buildJWE'

const port = 3000
const app = express()
app.use(express.json())
app.use(express.text())

app.get('/getPublicKeyAsJwkFromAWS', async (req: Request, res: Response) => {
	const rawPublicKey = await getKmsPublicKey(
		process.env['SET_SIGNING_KMS_KEY_ARN'] ?? ''
	)
	if (!rawPublicKey) throw Error('Could not find SET signing KMS key')

	const jwk = createJwkFromRawPublicKey(rawPublicKey)

	res.json({
		keys: [jwk],
	})
})

app.listen(port, () => console.log('Port listening on: ', port))

setInterval(async () => {
	const setToSend = await createSetUsingKms(1)
	console.log(setToSend)
	const data = await buildJWE(setToSend)

	const options = {
		method: 'POST',
		body: data,
	}

	console.log(options)
	console.log('Sending JWE')
	const response = await fetch(
		'http://localhost:4000/relyingPartyReceiverEndpoint',
		options
	)
	console.log('Response from server: ', await response.text())
}, 10000)
