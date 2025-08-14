import { env } from '@/config'
import { green } from 'console-log-colors'
import { app } from './app'

const PORT = env.PORT || 3333
const BASE_URL = env.BASE_URL || 'http://localhost'

app.listen(PORT, () => {
  console.log('🚀 Server running at', green(`${BASE_URL}:${PORT}`))
})
