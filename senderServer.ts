require('dotenv').config()
import express, { Request, Response } from 'express'
import { createJwkFromRawPublicKey } from './keys/generateJWKSObject'
import { getKmsPublicKey } from './keys/getKmsPublicKey'

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

app.listen(3000)
