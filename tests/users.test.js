import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('GET /users', () => {
  it('should return all users when no filter', async () => {
    const response = await request(app).get('/users')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(3)
    expect(response.body[0].name).toBe('Alice')
  })

  it('should filter users by name (case-insensitive)', async () => {
    const response = await request(app).get('/users?name=bob')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(1)
    expect(response.body[0].name).toBe('Bob')
  })

  it('should return empty array when no match', async () => {
    const response = await request(app).get('/users?name=nonexistent')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(0)
  })
})

describe('POST /users', () => {
  it('should create a new user with valid data', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'David', email: 'david@example.com' })

    expect(response.status).toBe(201)
    expect(response.body.id).toBeDefined()
    expect(response.body.name).toBe('David')
    expect(response.body.email).toBe('david@example.com')
  })

  it('should return 400 when name is missing', async () => {
    const response = await request(app)
      .post('/users')
      .send({ email: 'test@example.com' })

    expect(response.status).toBe(400)
  })

  it('should return 400 when email is missing', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'Test' })

    expect(response.status).toBe(400)
  })

  it('should return 400 when name is empty', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: '', email: 'test@example.com' })

    expect(response.status).toBe(400)
  })

  it('should return 400 when email is empty', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'Test', email: '' })

    expect(response.status).toBe(400)
  })

  it('should return 400 when email format is invalid', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'Test', email: 'invalid-email' })

    expect(response.status).toBe(400)
  })

  it('should return 409 when email already exists', async () => {
    await request(app)
      .post('/users')
      .send({ name: 'Test', email: 'duplicate@example.com' })

    const response = await request(app)
      .post('/users')
      .send({ name: 'Test2', email: 'duplicate@example.com' })

    expect(response.status).toBe(409)
  })
})
