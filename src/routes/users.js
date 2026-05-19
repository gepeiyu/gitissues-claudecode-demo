import { Router } from 'express'

const router = Router()

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' }
]

router.get('/', (req, res) => {
  let result = [...users]

  if (req.query.name) {
    const nameFilter = req.query.name.toLowerCase()
    result = result.filter(u => u.name.toLowerCase().includes(nameFilter))
  }

  res.json(result)
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

router.post('/', (req, res) => {
  const { name, email } = req.body

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'name is required' })
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'email is required' })
  }

  const trimmedEmail = email.trim()

  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json({ error: 'invalid email format' })
  }

  const existingUser = users.find(u => u.email.toLowerCase() === trimmedEmail.toLowerCase())
  if (existingUser) {
    return res.status(409).json({ error: 'email already exists' })
  }

  const newUser = {
    id: users.length + 1,
    name: name.trim(),
    email: trimmedEmail
  }

  users.push(newUser)
  res.status(201).json(newUser)
})

export default router
