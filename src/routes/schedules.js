import { Router } from 'express'
import { classes } from './classes.js'

const router = Router({ mergeParams: true })

const schedules = []

// Middleware to check if class exists
router.use((req, res, next) => {
  const classId = parseInt(req.params.id)
  const cls = classes.find(c => c.id === classId)

  if (!cls) {
    return res.status(404).json({ error: 'class not found' })
  }

  next()
})

// Export for testing reset
export { schedules }

// Validate dayOfWeek and period range
const validateSlot = (dayOfWeek, period) => {
  const errors = []
  if (dayOfWeek !== undefined) {
    const d = Number(dayOfWeek)
    if (!Number.isInteger(d) || d < 1 || d > 5) {
      errors.push('dayOfWeek must be an integer between 1 and 5')
    }
  }
  if (period !== undefined) {
    const p = Number(period)
    if (!Number.isInteger(p) || p < 1 || p > 5) {
      errors.push('period must be an integer between 1 and 5')
    }
  }
  return errors
}

// Check for slot conflict (same classId, dayOfWeek, period)
const checkConflict = (classId, dayOfWeek, period, excludeId = null) => {
  return schedules.some(s =>
    String(s.classId) === String(classId) &&
    s.dayOfWeek === dayOfWeek &&
    s.period === period &&
    s.id !== excludeId
  )
}

// POST /classes/:id/schedules - create schedule
router.post('/', (req, res) => {
  const classId = req.params.id

  const { dayOfWeek, period, subject } = req.body

  // Validate required fields
  if (dayOfWeek === undefined || period === undefined || !subject || !subject.trim()) {
    const missing = []
    if (dayOfWeek === undefined) missing.push('dayOfWeek')
    if (period === undefined) missing.push('period')
    if (!subject || !subject.trim()) missing.push('subject')
    return res.status(400).json({ error: `${missing.join(', ')} are required` })
  }

  const d = Number(dayOfWeek)
  const p = Number(period)

  // Validate range
  const slotErrors = validateSlot(d, p)
  if (slotErrors.length > 0) {
    return res.status(400).json({ error: slotErrors.join(', ') })
  }

  // Check conflict
  if (checkConflict(classId, d, p)) {
    return res.status(409).json({ error: 'schedule slot already occupied' })
  }

  const newSchedule = {
    id: String(schedules.length + 1),
    classId: String(classId),
    dayOfWeek: d,
    period: p,
    subject: subject.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  schedules.push(newSchedule)
  res.status(201).json(newSchedule)
})

// GET /classes/:id/schedules - get schedules for class
router.get('/', (req, res) => {
  const classId = req.params.id
  let result = schedules.filter(s => String(s.classId) === String(classId))

  if (req.query.dayOfWeek !== undefined) {
    const dayFilter = Number(req.query.dayOfWeek)
    result = result.filter(s => s.dayOfWeek === dayFilter)
  }

  res.json(result)
})

// PATCH /classes/:id/schedules/:scheduleId - update schedule
router.patch('/:scheduleId', (req, res) => {
  const classId = req.params.id
  const scheduleId = req.params.scheduleId
  const schedule = schedules.find(s => s.id === scheduleId && String(s.classId) === String(classId))

  if (!schedule) {
    return res.status(404).json({ error: 'schedule not found' })
  }

  const { dayOfWeek, period, subject } = req.body

  // Validate and update fields
  let newDayOfWeek = schedule.dayOfWeek
  let newPeriod = schedule.period

  if (dayOfWeek !== undefined) {
    const d = Number(dayOfWeek)
    const errors = validateSlot(d, undefined)
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') })
    }
    newDayOfWeek = d
  }

  if (period !== undefined) {
    const p = Number(period)
    const errors = validateSlot(undefined, p)
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') })
    }
    newPeriod = p
  }

  // Check conflict (excluding current schedule)
  if (checkConflict(classId, newDayOfWeek, newPeriod, scheduleId)) {
    return res.status(409).json({ error: 'schedule slot already occupied' })
  }

  // Apply updates
  if (dayOfWeek !== undefined) schedule.dayOfWeek = newDayOfWeek
  if (period !== undefined) schedule.period = newPeriod
  if (subject !== undefined) schedule.subject = subject.trim()
  schedule.updatedAt = new Date().toISOString()

  res.json(schedule)
})

// DELETE /classes/:id/schedules/:scheduleId - delete schedule
router.delete('/:scheduleId', (req, res) => {
  const classId = req.params.id
  const scheduleId = req.params.scheduleId
  const index = schedules.findIndex(s => s.id === scheduleId && String(s.classId) === String(classId))

  if (index === -1) {
    return res.status(404).json({ error: 'schedule not found' })
  }

  schedules.splice(index, 1)
  res.status(204).end()
})

export default router
