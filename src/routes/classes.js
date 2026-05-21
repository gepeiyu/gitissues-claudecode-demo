import { Router } from 'express'

const router = Router()

export const classes = []

router.get('/', (req, res) => {
  let result = [...classes]

  if (req.query.name) {
    const nameFilter = req.query.name.toLowerCase()
    result = result.filter(c => c.name.toLowerCase().includes(nameFilter))
  }

  res.json(result)
})

router.post('/', (req, res) => {
  const { name, grade } = req.body

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'name is required' })
  }

  const trimmedName = name.trim()

  const existingClass = classes.find(c => c.name === trimmedName)
  if (existingClass) {
    return res.status(500).json({ error: 'class name already exists' })
  }

  const newClass = {
    id: classes.length + 1,
    name: trimmedName,
    grade: grade || null,
    createdAt: new Date().toISOString()
  }

  classes.push(newClass)
  res.status(201).json(newClass)
})

router.get('/:id', (req, res) => {
  const classId = parseInt(req.params.id)
  const cls = classes.find(c => c.id === classId)

  if (!cls) {
    return res.status(404).json({ error: 'class not found' })
  }

  res.json(cls)
})

export default router
