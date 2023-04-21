require('dotenv').config()
import { createPublicKey } from 'crypto'
import express, { Request, Response } from 'express'
import { createJwkFromRawPublicKey } from './keys/generateJWKSObject'
import { getKmsPublicKey } from './keys/getKmsPublicKey'
import { extractDataFromJWE } from './parseJWE/extractDataFromJWE'
import { verifySETList } from './parseJWE/verifySET'

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

app.get('/getPublicKeyAsJwk', async (req: Request, res: Response) => {
	const publicKey = process.env['PUBLIC_KEY'] ?? ''
	const jwk = createPublicKey(publicKey).export({ format: 'jwk' })

	res.json({
		keys: [jwk],
	})
})

app.post(
	'/relyingPartyReceiverEndpoint',
	async (req: Request, res: Response) => {
		const jwe = req.body
		const nestedJws = await extractDataFromJWE(jwe)
		await verifySETList(nestedJws)
		console.log('All SETs verified')

		res.send('JWE Received')
	}
)

app.listen(port, () => console.log('Port listening on: ', port))
