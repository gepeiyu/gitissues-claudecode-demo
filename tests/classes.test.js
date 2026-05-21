import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { classes } from '../src/routes/classes.js'

beforeEach(() => {
  classes.length = 0
})

describe('GET /classes', () => {
  it('should return 200 and list of classes', async () => {
    const response = await request(app).get('/classes')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('should filter classes by name (case-insensitive)', async () => {
    await request(app)
      .post('/classes')
      .send({ name: 'Class A', grade: 'Grade 1', teacher: 'Teacher 1' })

    const response = await request(app).get('/classes?name=class a')

    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body[0].name).toBe('Class A')
  })

  it('should filter classes by grade (case-insensitive)', async () => {
    await request(app)
      .post('/classes')
      .send({ name: 'Class A', grade: '三年级', teacher: 'Teacher 1' })
    await request(app)
      .post('/classes')
      .send({ name: 'Class B', grade: '四年级', teacher: 'Teacher 2' })

    const response = await request(app).get('/classes?grade=三年级')

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
    expect(response.body[0].name).toBe('Class A')
  })

  it('should filter classes by teacher (case-insensitive)', async () => {
    await request(app)
      .post('/classes')
      .send({ name: 'Class A', grade: '三年级', teacher: '张老师' })
    await request(app)
      .post('/classes')
      .send({ name: 'Class B', grade: '四年级', teacher: '李老师' })

    const response = await request(app).get('/classes?teacher=张老师')

    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
    expect(response.body[0].name).toBe('Class A')
  })

  it('should return empty array when no match', async () => {
    const response = await request(app).get('/classes?name=nonexistent-class')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })
})

describe('POST /classes', () => {
  it('should create a new class with valid data', async () => {
    const response = await request(app)
      .post('/classes')
      .send({
        name: '三年级一班',
        grade: '三年级',
        teacher: '张老师',
        room: 'A101',
        studentCount: 30,
        description: '重点班'
      })

    expect(response.status).toBe(201)
    expect(response.body.id).toBeDefined()
    expect(response.body.name).toBe('三年级一班')
    expect(response.body.grade).toBe('三年级')
    expect(response.body.teacher).toBe('张老师')
    expect(response.body.room).toBe('A101')
    expect(response.body.studentCount).toBe(30)
    expect(response.body.description).toBe('重点班')
    expect(response.body.createdAt).toBeDefined()
    expect(response.body.updatedAt).toBeDefined()
  })

  it('should set default studentCount to 0 when not provided', async () => {
    const response = await request(app)
      .post('/classes')
      .send({ name: 'Class One', grade: 'Grade 2', teacher: 'Teacher' })

    expect(response.status).toBe(201)
    expect(response.body.studentCount).toBe(0)
  })

  it('should return 400 when name is missing', async () => {
    const response = await request(app)
      .post('/classes')
      .send({ grade: 'Grade 1', teacher: 'Teacher' })

    expect(response.status).toBe(400)
  })

  it('should return 400 when name is empty', async () => {
    const response = await request(app)
      .post('/classes')
      .send({ name: '', grade: 'Grade 1', teacher: 'Teacher' })

    expect(response.status).toBe(400)
  })

  it('should return 400 when grade is missing', async () => {
    const response = await request(app)
      .post('/classes')
      .send({ name: 'Class', teacher: 'Teacher' })

    expect(response.status).toBe(400)
  })

  it('should return 400 when teacher is missing', async () => {
    const response = await request(app)
      .post('/classes')
      .send({ name: 'Class', grade: 'Grade' })

    expect(response.status).toBe(400)
  })

  it('should return 409 when name already exists', async () => {
    await request(app)
      .post('/classes')
      .send({ name: 'Duplicate Class', grade: 'Grade 1', teacher: 'Teacher 1' })

    const response = await request(app)
      .post('/classes')
      .send({ name: 'Duplicate Class', grade: 'Grade 2', teacher: 'Teacher 2' })

    expect(response.status).toBe(409)
  })
})

describe('GET /classes/:id', () => {
  it('should return 200 and the class when id exists', async () => {
    const createRes = await request(app)
      .post('/classes')
      .send({ name: 'Class One', grade: 'Grade 1', teacher: 'Teacher' })

    const response = await request(app).get(`/classes/${createRes.body.id}`)

    expect(response.status).toBe(200)
    expect(response.body.id).toBe(createRes.body.id)
    expect(response.body.name).toBe('Class One')
  })

  it('should return 404 when id does not exist', async () => {
    const response = await request(app).get('/classes/99999')

    expect(response.status).toBe(404)
  })
})

describe('PATCH /classes/:id', () => {
  it('should update class with valid data', async () => {
    const createRes = await request(app)
      .post('/classes')
      .send({ name: 'Class One', grade: 'Grade 1', teacher: 'Teacher 1' })

    const response = await request(app)
      .patch(`/classes/${createRes.body.id}`)
      .send({ name: 'Class Updated', grade: 'Grade 2', teacher: 'Teacher 2' })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Class Updated')
    expect(response.body.grade).toBe('Grade 2')
    expect(response.body.teacher).toBe('Teacher 2')
    expect(response.body.updatedAt).not.toBe(createRes.body.updatedAt)
  })

  it('should update individual fields', async () => {
    const createRes = await request(app)
      .post('/classes')
      .send({ name: 'Class One', grade: 'Grade 1', teacher: 'Teacher 1' })

    const response = await request(app)
      .patch(`/classes/${createRes.body.id}`)
      .send({ room: 'B202', studentCount: 25 })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Class One')
    expect(response.body.room).toBe('B202')
    expect(response.body.studentCount).toBe(25)
  })

  it('should return 404 when id does not exist', async () => {
    const response = await request(app)
      .patch('/classes/99999')
      .send({ name: 'New Name' })

    expect(response.status).toBe(404)
  })

  it('should return 400 when name is empty', async () => {
    const createRes = await request(app)
      .post('/classes')
      .send({ name: 'Class One', grade: 'Grade 1', teacher: 'Teacher 1' })

    const response = await request(app)
      .patch(`/classes/${createRes.body.id}`)
      .send({ name: '' })

    expect(response.status).toBe(400)
  })

  it('should return 400 when studentCount is negative', async () => {
    const createRes = await request(app)
      .post('/classes')
      .send({ name: 'Class One', grade: 'Grade 1', teacher: 'Teacher 1' })

    const response = await request(app)
      .patch(`/classes/${createRes.body.id}`)
      .send({ studentCount: -5 })

    expect(response.status).toBe(400)
  })

  it('should return 409 when updating to an existing name', async () => {
    await request(app)
      .post('/classes')
      .send({ name: 'Class A', grade: 'Grade 1', teacher: 'Teacher 1' })
    const createRes = await request(app)
      .post('/classes')
      .send({ name: 'Class B', grade: 'Grade 1', teacher: 'Teacher 2' })

    const response = await request(app)
      .patch(`/classes/${createRes.body.id}`)
      .send({ name: 'Class A' })

    expect(response.status).toBe(409)
  })
})

describe('DELETE /classes/:id', () => {
  it('should delete class and return 204', async () => {
    const createRes = await request(app)
      .post('/classes')
      .send({ name: 'Class One', grade: 'Grade 1', teacher: 'Teacher' })

    const response = await request(app).delete(`/classes/${createRes.body.id}`)

    expect(response.status).toBe(204)

    const getRes = await request(app).get(`/classes/${createRes.body.id}`)
    expect(getRes.status).toBe(404)
  })

  it('should return 404 when id does not exist', async () => {
    const response = await request(app).delete('/classes/99999')

    expect(response.status).toBe(404)
  })
})
