import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('GET /users', () => {
  it('should return all users with age and gender fields', async () => {
    const response = await request(app).get('/users')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(3)
    expect(response.body[0].name).toBe('Alice')
    expect(response.body[0].age).toBeDefined()
    expect(response.body[0].gender).toBeDefined()
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

  it('should create user with age and gender fields', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'Eve', email: 'eve@example.com', age: 25, gender: 'female' })

    expect(response.status).toBe(201)
    expect(response.body.age).toBe(25)
    expect(response.body.gender).toBe('female')
  })

  it('should accept user creation without age and gender', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'Frank', email: 'frank@example.com' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('age')
    expect(response.body).toHaveProperty('gender')
  })
})

describe('PATCH /users/:id', () => {
  it('should update user email, age and gender', async () => {
    const createResponse = await request(app)
      .post('/users')
      .send({ name: 'Grace', email: 'grace@example.com', age: 30, gender: 'female' })
    const userId = createResponse.body.id

    const response = await request(app)
      .patch(`/users/${userId}`)
      .send({ email: 'grace.updated@example.com', age: 31, gender: 'other' })

    expect(response.status).toBe(200)
    expect(response.body.email).toBe('grace.updated@example.com')
    expect(response.body.age).toBe(31)
    expect(response.body.gender).toBe('other')
    expect(response.body.name).toBe('Grace')
  })

  it('should ignore name field updates', async () => {
    const createResponse = await request(app)
      .post('/users')
      .send({ name: 'Henry', email: 'henry@example.com' })
    const userId = createResponse.body.id

    const response = await request(app)
      .patch(`/users/${userId}`)
      .send({ name: 'Henry Updated', email: 'henry2@example.com' })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Henry')
    expect(response.body.email).toBe('henry2@example.com')
  })

  it('should return 404 for non-existent user', async () => {
    const response = await request(app)
      .patch('/users/9999')
      .send({ email: 'test@example.com' })

    expect(response.status).toBe(404)
  })

  it('should return 400 for invalid email format', async () => {
    const createResponse = await request(app)
      .post('/users')
      .send({ name: 'Ivy', email: 'ivy@example.com' })
    const userId = createResponse.body.id

    const response = await request(app)
      .patch(`/users/${userId}`)
      .send({ email: 'invalid-email' })

    expect(response.status).toBe(400)
  })

  it('should return 400 for non-positive age', async () => {
    const createResponse = await request(app)
      .post('/users')
      .send({ name: 'Jack', email: 'jack@example.com' })
    const userId = createResponse.body.id

    const response = await request(app)
      .patch(`/users/${userId}`)
      .send({ age: 0 })

    expect(response.status).toBe(400)
  })

  it('should allow partial updates (only email)', async () => {
    const createResponse = await request(app)
      .post('/users')
      .send({ name: 'Kate', email: 'kate@example.com', age: 28, gender: 'female' })
    const userId = createResponse.body.id

    const response = await request(app)
      .patch(`/users/${userId}`)
      .send({ email: 'kate.new@example.com' })

    expect(response.status).toBe(200)
    expect(response.body.email).toBe('kate.new@example.com')
    expect(response.body.age).toBe(28)
    expect(response.body.gender).toBe('female')
  })
})
