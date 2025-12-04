const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server');
const User = require('../models/User');
const Test = require('../models/Test');

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Wait for database connection
beforeAll(async () => {
  await new Promise(resolve => {
    if (mongoose.connection.readyState === 1) {
      resolve();
    } else {
      mongoose.connection.once('open', resolve);
    }
  });
});

describe('Healthcare API Tests', () => {
  test('should signup a new patient', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'patient1',
        password: 'pass123',
        role: 'patient'
      });

    expect(res.statusCode).toBe(201);
  });

  test('should login with valid credentials', async () => {
    await request(app)
      .post('/api/auth/signup')
      .send({
        username: 'testuser',
        password: 'pass123',
        role: 'patient'
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'pass123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('should create a test request', async () => {
    const patient = await User.create({
      username: 'patient2',
      password: 'hashed',
      role: 'patient'
    });

    const token = jwt.sign({ id: patient._id, role: 'patient' }, JWT_SECRET);

    const res = await request(app)
      .post('/api/tests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        testName: 'Blood Test',
        disease: 'Diabetes'
      });

    expect(res.statusCode).toBe(201);
  });

  test('should reject request without auth token', async () => {
    const res = await request(app)
      .post('/api/tests')
      .send({
        testName: 'Blood Test',
        disease: 'Diabetes'
      });

    expect(res.statusCode).toBe(401);
  });

  test('should get patient tests', async () => {
    const patient = await User.create({
      username: 'patient3',
      password: 'hashed',
      role: 'patient'
    });

    await Test.create({
      testName: 'Test 1',
      disease: 'Diabetes',
      patient: patient._id
    });

    const token = jwt.sign({ id: patient._id, role: 'patient' }, JWT_SECRET);

    const res = await request(app)
      .get('/api/tests')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
