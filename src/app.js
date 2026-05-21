import express from 'express'
import usersRouter from './routes/users.js'
import classesRouter from './routes/classes.js'
import schedulesRouter from './routes/schedules.js'

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
app.use('/classes/:id/schedules', schedulesRouter)

export default app
