import { Router } from 'express'

const router = Router()

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 25, gender: 'female', class: '三年一班' },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 30, gender: 'male', class: '三年二班' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35, gender: 'male' }
]

router.get('/', (req, res) => {
  let result = [...users]

  if (req.query.name) {
    const nameFilter = req.query.name.toLowerCase()
    result = result.filter(u => u.name.toLowerCase().includes(nameFilter))
  }

  if (req.query.class) {
    const classFilter = req.query.class.toLowerCase()
    result = result.filter(u => u.class && u.class.toLowerCase().includes(classFilter))
  }

  res.json(result)
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

router.post('/', (req, res) => {
  const { name, email, age, gender, class: userClass } = req.body

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
    email: trimmedEmail,
    age: age || null,
    gender: gender || null,
    class: userClass || null
  }

  users.push(newUser)
  res.status(201).json(newUser)
})

router.patch('/:id', (req, res) => {
  const userId = parseInt(req.params.id)
  const user = users.find(u => u.id === userId)

  if (!user) {
    return res.status(404).json({ error: 'user not found' })
  }

  const { email, age, gender, class: userClass } = req.body

  if (email !== undefined) {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      return res.status(400).json({ error: 'email cannot be empty' })
    }
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({ error: 'invalid email format' })
    }
    user.email = trimmedEmail
  }

  if (age !== undefined) {
    const parsedAge = parseInt(age)
    if (!Number.isInteger(parsedAge) || parsedAge <= 0) {
      return res.status(400).json({ error: 'age must be a positive integer' })
    }
    user.age = parsedAge
  }

  if (gender !== undefined) {
    user.gender = gender
  }

  if (userClass !== undefined) {
    user.class = userClass
  }

  res.json(user)
})

export default router
