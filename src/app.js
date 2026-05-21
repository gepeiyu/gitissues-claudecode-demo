import express from 'express'
import usersRouter from './routes/users.js'
import classesRouter from './routes/classes.js'

const app = express()

app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  })
})

app.use('/users', usersRouter)
app.use('/classes', classesRouter)

export default app
