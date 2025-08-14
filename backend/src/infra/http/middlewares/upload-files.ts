import fs from 'node:fs'
import multer from 'multer'

const storage = multer.diskStorage({
  destination: (req, _, cb) => {
    const userId = req.userId
    const path = `./audios/${userId}`

    if (!userId) {
      console.error('Usuário não encontrado.')
      return
    }

    if (!fs.existsSync('./audios')) {
      fs.mkdirSync('./audios')
    }

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }

    if (fs.existsSync(path)) {
      cb(null, path)
    }
  },
  filename: (req, file, cb) => {
    const userId = req.userId
    cb(null, `last-uploaded-${userId}.${file.mimetype.split('/')[1]}`)
  }
})

export const upload = multer({ storage })
