require('dotenv').config()
import express, { Request, Response } from 'express'
import { createJwkFromRawPublicKey } from './keys/generateJWKSObject'
import { getKmsPublicKey } from './keys/getKmsPublicKey'
import fetch from 'node-fetch'
import { createSetUsingKms } from './createJWS/createSetUsingKms'
import { buildJWE } from './createJWE/buildJWE'

const port = 3000
const app = express()
app.use(express.json())

app.get('/getPublicKeyAsJwk', async (req: Request, res: Response) => {
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
	const data = await buildJWE(setToSend)
	const options = {
		method: 'POST',
		body: data,
	}
	console.log(options)

	await fetch('http://localhost:4000/relyingPartyReceiverEndpoint', options)
}, 5000)
