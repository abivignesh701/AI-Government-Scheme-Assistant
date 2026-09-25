import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import { User } from '../app/models/User';


beforeAll(async () => {
  const uri = 'mongodb://127.0.0.1:27017/arogyasathi_test_' + Math.random().toString(36).substring(7);

  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = 'test-secret';
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoose.connection.db) { await mongoose.connection.db.dropDatabase(); }
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Auth API', () => {
  it('should sign up a user successfully', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      preferred_language: 'en'
    });
    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe('john@example.com');
  });

  it('should prevent duplicate signup', async () => {
    await request(app).post('/api/v1/auth/signup').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });
    
    const res = await request(app).post('/api/v1/auth/signup').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });
    expect(res.status).toBe(409);
    expect(res.body.error.message).toBe('Account already exists');
  });

  it('should fail signup with invalid email', async () => {
    const res = await request(app).post('/api/v1/auth/signup').send({
      name: 'John Doe',
      email: 'invalid-email',
      password: 'password123'
    });
    expect(res.status).toBe(400);
  });

  it('should login a user successfully', async () => {
    await request(app).post('/api/v1/auth/signup').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });

    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'john@example.com',
      password: 'password123'
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail login with wrong password', async () => {
    await request(app).post('/api/v1/auth/signup').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });

    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'john@example.com',
      password: 'wrongpassword'
    });
    expect(res.status).toBe(401);
  });

  it('should protect against NoSQL injection', async () => {
    await request(app).post('/api/v1/auth/signup').send({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'password123'
    });

    const res = await request(app).post('/api/v1/auth/login').send({
      email: { $ne: null },
      password: 'password123'
    });
    expect(res.status).toBe(401); // Controller rejects non-string email
  });

  it('should fetch current user', async () => {
    await request(app).post('/api/v1/auth/signup').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });

    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'john@example.com',
      password: 'password123'
    });
    const token = loginRes.body.token;

    const meRes = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${token}`);
    expect(meRes.status).toBe(200);
    expect(meRes.body.user.email).toBe('john@example.com');
  });
});
