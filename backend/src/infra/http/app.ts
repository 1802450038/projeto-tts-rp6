import 'express-async-errors'
import cors from 'cors'
import express from 'express'
import { interceptErrors } from './middlewares/intercept-errors'
import { router } from './routes'

export const app = express()

app.use(cors())
app.use(express.json())
app.get('/', (_, res) => res.status(200).send('Olá, mundo!'))
app.use('/api/v1', router)
app.use(interceptErrors)
