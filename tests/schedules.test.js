import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { classes } from '../src/routes/classes.js'
import { schedules } from '../src/routes/schedules.js'

describe('Schedules API', () => {
  let testClassId

  beforeEach(async () => {
    // Reset data
    classes.length = 0
    schedules.length = 0

    // 创建测试班级
    const response = await request(app)
      .post('/classes')
      .send({ name: '三年一班', grade: 3 })
    testClassId = response.body.id
  })

  describe('POST /classes/:id/schedules', () => {
    it('should create a new schedule', async () => {
      const response = await request(app)
        .post(`/classes/${testClassId}/schedules`)
        .send({ dayOfWeek: 1, period: 1, subject: '语文' })

      expect(response.status).toBe(201)
      expect(response.body.id).toBeDefined()
      expect(response.body.classId).toBe(String(testClassId))
      expect(response.body.dayOfWeek).toBe(1)
      expect(response.body.period).toBe(1)
      expect(response.body.subject).toBe('语文')
    })

    it('should return 400 when dayOfWeek is missing', async () => {
      const response = await request(app)
        .post(`/classes/${testClassId}/schedules`)
        .send({ period: 1, subject: '语文' })

      expect(response.status).toBe(400)
    })

    it('should return 400 when period is missing', async () => {
      const response = await request(app)
        .post(`/classes/${testClassId}/schedules`)
        .send({ dayOfWeek: 1, subject: '语文' })

      expect(response.status).toBe(400)
    })

    it('should return 400 when subject is missing', async () => {
      const response = await request(app)
        .post(`/classes/${testClassId}/schedules`)
        .send({ dayOfWeek: 1, period: 1 })

      expect(response.status).toBe(400)
    })

    it('should return 400 when dayOfWeek is out of range (1-5)', async () => {
      const response1 = await request(app)
        .post(`/classes/${testClassId}/schedules`)
        .send({ dayOfWeek: 0, period: 1, subject: '语文' })
      expect(response1.status).toBe(400)

      const response2 = await request(app)
        .post(`/classes/${testClassId}/schedules`)
        .send({ dayOfWeek: 6, period: 1, subject: '语文' })
      expect(response2.status).toBe(400)
    })

    it('should return 400 when period is out of range (1-5)', async () => {
      const response1 = await request(app)
        .post(`/classes/${testClassId}/schedules`)
        .send({ dayOfWeek: 1, period: 0, subject: '语文' })
      expect(response1.status).toBe(400)

      const response2 = await request(app)
        .post(`/classes/${testClassId}/schedules`)
        .send({ dayOfWeek: 1, period: 6, subject: '语文' })
      expect(response2.status).toBe(400)
    })

    it('should return 409 when schedule slot (dayOfWeek + period) conflicts', async () => {
      await request(app)
        .post(`/classes/${testClassId}/schedules`)
        .send({ dayOfWeek: 1, period: 1, subject: '语文' })

      const response = await request(app)
        .post(`/classes/${testClassId}/schedules`)
        .send({ dayOfWeek: 1, period: 1, subject: '数学' })

      expect(response.status).toBe(409)
    })

    it('should return 404 when class does not exist', async () => {
      const response = await request(app)
        .post('/classes/9999/schedules')
        .send({ dayOfWeek: 1, period: 1, subject: '语文' })

      expect(response.status).toBe(404)
    })
  })

  describe('GET /classes/:id/schedules', () => {
    beforeEach(async () => {
      await request(app)
        .post(`/classes/${testClassId}/schedules`)
        .send({ dayOfWeek: 1, period: 1, subject: '语文' })
      await request(app)
        .post(`/classes/${testClassId}/schedules`)
        .send({ dayOfWeek: 1, period: 2, subject: '数学' })
      await request(app)
        .post(`/classes/${testClassId}/schedules`)
        .send({ dayOfWeek: 2, period: 1, subject: '英语' })
    })

    it('should return all schedules for the class', async () => {
      const response = await request(app)
        .get(`/classes/${testClassId}/schedules`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(3)
    })

    it('should filter schedules by dayOfWeek', async () => {
      const response = await request(app)
        .get(`/classes/${testClassId}/schedules?dayOfWeek=1`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(2)
      expect(response.body.every(s => s.dayOfWeek === 1)).toBe(true)
    })

    it('should return empty array when no schedules for the day', async () => {
      const response = await request(app)
        .get(`/classes/${testClassId}/schedules?dayOfWeek=5`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(0)
    })

    it('should return empty array when class has no schedules', async () => {
      const newClass = await request(app)
        .post('/classes')
        .send({ name: '三年二班', grade: 3 })

      const response = await request(app)
        .get(`/classes/${newClass.body.id}/schedules`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveLength(0)
    })

    it('should return 404 when class does not exist', async () => {
      const response = await request(app)
        .get('/classes/9999/schedules')

      expect(response.status).toBe(404)
    })
  })

  describe('PATCH /classes/:id/schedules/:scheduleId', () => {
    let scheduleId

    beforeEach(async () => {
      const response = await request(app)
        .post(`/classes/${testClassId}/schedules`)
        .send({ dayOfWeek: 1, period: 1, subject: '语文' })
      scheduleId = response.body.id
    })

    it('should update schedule subject', async () => {
      const response = await request(app)
        .patch(`/classes/${testClassId}/schedules/${scheduleId}`)
        .send({ subject: '数学' })

      expect(response.status).toBe(200)
      expect(response.body.subject).toBe('数学')
    })

    it('should update dayOfWeek and period', async () => {
      const response = await request(app)
        .patch(`/classes/${testClassId}/schedules/${scheduleId}`)
        .send({ dayOfWeek: 2, period: 3 })

      expect(response.status).toBe(200)
      expect(response.body.dayOfWeek).toBe(2)
      expect(response.body.period).toBe(3)
    })

    it('should return 409 when update causes slot conflict', async () => {
      await request(app)
        .post(`/classes/${testClassId}/schedules`)
        .send({ dayOfWeek: 2, period: 1, subject: '数学' })

      const response = await request(app)
        .patch(`/classes/${testClassId}/schedules/${scheduleId}`)
        .send({ dayOfWeek: 2, period: 1, subject: '英语' })

      expect(response.status).toBe(409)
    })

    it('should not return conflict when updating same schedule to same slot', async () => {
      const response = await request(app)
        .patch(`/classes/${testClassId}/schedules/${scheduleId}`)
        .send({ dayOfWeek: 1, period: 1, subject: '语文更新' })

      expect(response.status).toBe(200)
      expect(response.body.subject).toBe('语文更新')
    })

    it('should return 400 when invalid dayOfWeek', async () => {
      const response = await request(app)
        .patch(`/classes/${testClassId}/schedules/${scheduleId}`)
        .send({ dayOfWeek: 0 })

      expect(response.status).toBe(400)
    })

    it('should return 400 when invalid period', async () => {
      const response = await request(app)
        .patch(`/classes/${testClassId}/schedules/${scheduleId}`)
        .send({ period: 6 })

      expect(response.status).toBe(400)
    })

    it('should return 404 when schedule does not exist', async () => {
      const response = await request(app)
        .patch(`/classes/${testClassId}/schedules/nonexistent`)
        .send({ subject: '数学' })

      expect(response.status).toBe(404)
    })

    it('should return 404 when class does not exist', async () => {
      const response = await request(app)
        .patch(`/classes/9999/schedules/${scheduleId}`)
        .send({ subject: '数学' })

      expect(response.status).toBe(404)
    })
  })

  describe('DELETE /classes/:id/schedules/:scheduleId', () => {
    let scheduleId

    beforeEach(async () => {
      const response = await request(app)
        .post(`/classes/${testClassId}/schedules`)
        .send({ dayOfWeek: 1, period: 1, subject: '语文' })
      scheduleId = response.body.id
    })

    it('should delete a schedule', async () => {
      const response = await request(app)
        .delete(`/classes/${testClassId}/schedules/${scheduleId}`)

      expect(response.status).toBe(204)

      // Verify it's gone
      const getResponse = await request(app)
        .get(`/classes/${testClassId}/schedules`)
      expect(getResponse.body).toHaveLength(0)
    })

    it('should return 404 when schedule does not exist', async () => {
      const response = await request(app)
        .delete(`/classes/${testClassId}/schedules/nonexistent`)

      expect(response.status).toBe(404)
    })

    it('should return 404 when class does not exist', async () => {
      const response = await request(app)
        .delete(`/classes/9999/schedules/${scheduleId}`)

      expect(response.status).toBe(404)
    })
  })
})
