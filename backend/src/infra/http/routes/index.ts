import { Router } from 'express'
import { auth } from './auth.routes'
import { documents } from './documents.routes'
import { uploadFiles } from './upload-files.routes'
import { user } from './user.routes'

export const router = Router()

router.use('/auth', auth)
router.use('/users', user)
router.use('/upload-file', uploadFiles)
router.use('/documents', documents)
