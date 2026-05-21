import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import usersRouter from './routes/users.js'
import classesRouter from './routes/classes.js'
import schedulesRouter from './routes/schedules.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

app.use(express.json())
app.use(express.static(join(__dirname, '../public')))

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

app.use('/users', usersRouter)
app.use('/classes', classesRouter)
app.use('/classes/:id/schedules', schedulesRouter)

export default app
