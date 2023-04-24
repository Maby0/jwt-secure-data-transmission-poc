require('dotenv').config()
import express, { Request, Response } from 'express'
import { extractDataFromJWE } from './receiver/parseJWE/extractDataFromJWE'
import { verifyJWSList } from './receiver/parseJWE/verifyJWS'
import { createJwkFromRawPublicKey } from './shared/keys/generateJWKSObject'
import { getKmsPublicKey } from './shared/keys/getKmsPublicKey'

const port = 4000
const app = express()
app.use(express.text())

app.get('/getPublicKeyAsJwkFromAWS', async (req: Request, res: Response) => {
	const rawPublicKey = await getKmsPublicKey(
		process.env['KEY_ENCRYPTION_KEY'] ?? ''
	)
	if (!rawPublicKey) throw Error('Could not find SET signing KMS key')

	const jwk = createJwkFromRawPublicKey(rawPublicKey)

	res.json({
		keys: [jwk],
	})
})

app.post(
	'/relyingPartyReceiverEndpoint',
	async (req: Request, res: Response) => {
		const jwe = req.body
		const nestedJws = await extractDataFromJWE(jwe)
		await verifyJWSList(nestedJws)
		console.log('All SETs verified')

		res.send('JWE Received and nested SETs verified')
	}
)

app.listen(port, () => console.log('Port listening on: ', port))
