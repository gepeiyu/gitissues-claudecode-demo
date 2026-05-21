import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('GET /classes', () => {
  it('should return 200 and list of classes', async () => {
    const response = await request(app).get('/classes')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('should filter classes by name (case-insensitive)', async () => {
    await request(app)
      .post('/classes')
      .send({ name: 'Class A', grade: 'Grade 1' })

    const response = await request(app).get('/classes?name=class a')

    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0)
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
      .send({ name: 'Class One', grade: 'Grade 2' })

    expect(response.status).toBe(201)
    expect(response.body.id).toBeDefined()
    expect(response.body.name).toBe('Class One')
    expect(response.body.grade).toBe('Grade 2')
    expect(response.body.createdAt).toBeDefined()
  })

  it('should return 400 when name is missing', async () => {
    const response = await request(app)
      .post('/classes')
      .send({ grade: 'Grade 1' })

    expect(response.status).toBe(400)
  })

  it('should return 400 when name is empty', async () => {
    const response = await request(app)
      .post('/classes')
      .send({ name: '', grade: 'Grade 1' })

    expect(response.status).toBe(400)
  })

  it('should return 500 when name already exists', async () => {
    await request(app)
      .post('/classes')
      .send({ name: 'Duplicate Class', grade: 'Grade 1' })

    const response = await request(app)
      .post('/classes')
      .send({ name: 'Duplicate Class', grade: 'Grade 2' })

    expect(response.status).toBe(500)
  })
})
