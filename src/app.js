import express from 'express'
import usersRouter from './routes/users.js'

const app = express()

app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

app.use('/users', usersRouter)

export default app
