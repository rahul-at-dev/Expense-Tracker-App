const request = require('supertest')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')
const app = require('../src/app')
const User = require('../src/models/User')
const jwt = require('jsonwebtoken')

let mongoServer
let token

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  process.env.JWT_SECRET = 'testsecret'

  // create user
  const user = await User.create({ name: 'Test', email: 'test@example.com', password: 'password' })
  token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

test('create and fetch budget for month', async () => {
  const month = '2026-06'
  const res = await request(app)
    .post('/api/budgets')
    .set('Authorization', `Bearer ${token}`)
    .send({ amount: 5000, month })

  expect(res.statusCode).toBe(200)
  expect(res.body.success).toBe(true)
  expect(res.body.data.amount).toBe(5000)

  const getRes = await request(app)
    .get(`/api/budgets/${month}`)
    .set('Authorization', `Bearer ${token}`)
  expect(getRes.statusCode).toBe(200)
  expect(getRes.body.success).toBe(true)
  expect(getRes.body.data.budget.amount).toBe(5000)
})

test('get current budget (none set) returns 200 with budget null', async () => {
  const res = await request(app)
    .get('/api/budgets/current')
    .set('Authorization', `Bearer ${token}`)
  expect(res.statusCode).toBe(200)
  expect(res.body.success).toBe(true)
})
