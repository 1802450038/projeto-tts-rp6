import { includeHeadersFile } from '@/core/infra/adapters/express-include-headers-file'
import { adaptMiddleware } from '@/core/infra/adapters/express-middleware-adapter'
import { adaptRoute } from '@/core/infra/adapters/express-route-adapter'
import { Router } from 'express'
import { makeEnsureAuthenticated } from '../factories/controllers/middlewares/makeEnsureAuthenticated'
import { makeDeleteDocumentController } from '../factories/controllers/uploaded-files/makeDeleteDocumentController'
import { makeGetByPageNumberController } from '../factories/controllers/uploaded-files/makeGetByPageNumberController'
import { makeGetDocumentsByUserController } from '../factories/controllers/uploaded-files/makeGetDocumentsByUserController'
import { makeGetDownloadFileController } from '../factories/controllers/uploaded-files/makeGetDownloadFileController'

export const documents = Router()

documents.use(adaptMiddleware(makeEnsureAuthenticated()))

documents.get('/', adaptRoute(makeGetDocumentsByUserController()))
documents.get(
  '/download-file',
  adaptRoute(makeGetDownloadFileController(), includeHeadersFile)
)
documents.get('/single', adaptRoute(makeGetByPageNumberController()))
documents.delete('/:documentId', adaptRoute(makeDeleteDocumentController()))
