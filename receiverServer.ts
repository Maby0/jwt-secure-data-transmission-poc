require('dotenv').config()
import express, { Request, Response } from 'express'
import { createJwkFromRawPublicKey } from './shared/keys/generateJWKSObject'
import { getKmsPublicKey } from './shared/keys/kms/getKmsPublicKey'
import { parseAndVerifyData } from './receiver/parseAndVerifyData/parseAndVerifyData'

const port = 4000
const app = express()
app.use(express.text())

app.get('/getPublicKeyAsJwkFromAWS', async (req: Request, res: Response) => {
	const rawPublicKey = await getKmsPublicKey(
		process.env['KEY_ENCRYPTION_KEY_ARN'] ?? ''
	)
	if (!rawPublicKey) throw Error('Could not find Key Encryption KMS Key')

	const jwk = createJwkFromRawPublicKey(rawPublicKey)

	res.json({
		keys: [jwk],
	})
})

app.post(
	'/relyingPartyReceiverEndpoint',
	async (req: Request, res: Response) => {
		const jwe = req.body
		await parseAndVerifyData(jwe)
		console.log('All JWSs verified')

		res.send('JWE received and nested JWSs verified')
	}
)

app.listen(port, () => console.log('Port listening on: ', port))
