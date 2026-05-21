import { Router } from 'express'

const router = Router()

export const classes = []

router.get('/', (req, res) => {
  let result = [...classes]

  if (req.query.name) {
    const nameFilter = req.query.name.toLowerCase()
    result = result.filter(c => c.name.toLowerCase().includes(nameFilter))
  }

  if (req.query.grade) {
    const gradeFilter = req.query.grade.toLowerCase()
    result = result.filter(c => c.grade && c.grade.toLowerCase().includes(gradeFilter))
  }

  if (req.query.teacher) {
    const teacherFilter = req.query.teacher.toLowerCase()
    result = result.filter(c => c.teacher && c.teacher.toLowerCase().includes(teacherFilter))
  }

  res.json(result)
})

router.post('/', (req, res) => {
  const { name, grade, teacher, room, studentCount, description } = req.body

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'name is required' })
  }

  if (!grade || !grade.trim()) {
    return res.status(400).json({ error: 'grade is required' })
  }

  if (!teacher || !teacher.trim()) {
    return res.status(400).json({ error: 'teacher is required' })
  }

  const trimmedName = name.trim()

  const existingClass = classes.find(c => c.name === trimmedName)
  if (existingClass) {
    return res.status(409).json({ error: 'class name already exists' })
  }

  const now = new Date().toISOString()
  const newClass = {
    id: classes.length + 1,
    name: trimmedName,
    grade: grade.trim(),
    teacher: teacher.trim(),
    room: room && room.trim() ? room.trim() : null,
    studentCount: studentCount !== undefined ? parseInt(studentCount) : 0,
    description: description && description.trim() ? description.trim() : null,
    createdAt: now,
    updatedAt: now
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

router.patch('/:id', (req, res) => {
  const classId = parseInt(req.params.id)
  const cls = classes.find(c => c.id === classId)

  if (!cls) {
    return res.status(404).json({ error: 'class not found' })
  }

  const { name, grade, teacher, room, studentCount, description } = req.body

  if (name !== undefined) {
    const trimmedName = name.trim()
    if (!trimmedName) {
      return res.status(400).json({ error: 'name cannot be empty' })
    }
    const existingClass = classes.find(c => c.id !== classId && c.name === trimmedName)
    if (existingClass) {
      return res.status(409).json({ error: 'class name already exists' })
    }
    cls.name = trimmedName
  }

  if (grade !== undefined) {
    const trimmedGrade = grade.trim()
    if (!trimmedGrade) {
      return res.status(400).json({ error: 'grade cannot be empty' })
    }
    cls.grade = trimmedGrade
  }

  if (teacher !== undefined) {
    const trimmedTeacher = teacher.trim()
    if (!trimmedTeacher) {
      return res.status(400).json({ error: 'teacher cannot be empty' })
    }
    cls.teacher = trimmedTeacher
  }

  if (room !== undefined) {
    cls.room = room && room.trim() ? room.trim() : null
  }

  if (studentCount !== undefined) {
    const parsedCount = parseInt(studentCount)
    if (!Number.isInteger(parsedCount) || parsedCount < 0) {
      return res.status(400).json({ error: 'studentCount must be a non-negative integer' })
    }
    cls.studentCount = parsedCount
  }

  if (description !== undefined) {
    cls.description = description && description.trim() ? description.trim() : null
  }

  cls.updatedAt = new Date().toISOString()

  res.json(cls)
})

router.delete('/:id', (req, res) => {
  const classId = parseInt(req.params.id)
  const index = classes.findIndex(c => c.id === classId)

  if (index === -1) {
    return res.status(404).json({ error: 'class not found' })
  }

  classes.splice(index, 1)
  res.status(204).send()
})

export default router
