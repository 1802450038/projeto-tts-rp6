import { adaptMiddleware } from '@/core/infra/adapters/express-middleware-adapter'
import { adaptRoute } from '@/core/infra/adapters/express-route-adapter'
import { Router } from 'express'
import { makeEnsureAuthenticated } from '../factories/controllers/middlewares/makeEnsureAuthenticated'
import { makeProcessUploadedFilesController } from '../factories/controllers/uploaded-files/makeProcessUploadedFilesController'
import { upload } from '../middlewares/upload-files'

export const uploadFiles = Router()

uploadFiles.use(adaptMiddleware(makeEnsureAuthenticated()))
uploadFiles.use(upload.single('file'))

uploadFiles.post('/', adaptRoute(makeProcessUploadedFilesController()))
