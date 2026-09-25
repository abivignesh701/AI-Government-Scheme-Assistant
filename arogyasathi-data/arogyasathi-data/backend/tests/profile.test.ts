import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import { User } from '../app/models/User';
import { CitizenProfile } from '../app/models/CitizenProfile';

let token: string;
let userId: string;
let token2: string; // for user B

jest.setTimeout(30000);

beforeAll(async () => {
  const uri = 'mongodb://127.0.0.1:27017/arogyasathi_test_' + Math.random().toString(36).substring(7);

  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = 'test-secret';
  await mongoose.connect(uri);

  // Setup user A
  const signupRes = await request(app).post('/api/v1/auth/signup').send({
    name: 'User A',
    email: 'usera@example.com',
    password: 'password123'
  });
  
  const loginRes = await request(app).post('/api/v1/auth/login').send({
    email: 'usera@example.com',
    password: 'password123'
  });
  token = loginRes.body.token;
  userId = loginRes.body.user.id;

  // Setup user B
  await request(app).post('/api/v1/auth/signup').send({
    name: 'User B',
    email: 'userb@example.com',
    password: 'password123'
  });
  const loginRes2 = await request(app).post('/api/v1/auth/login').send({
    email: 'userb@example.com',
    password: 'password123'
  });
  token2 = loginRes2.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoose.connection.db) { await mongoose.connection.db.dropDatabase(); }
});

afterEach(async () => {
  await CitizenProfile.deleteMany({});
});

describe('Citizen Profile API', () => {
  it('should create a SELF profile draft', async () => {
    const res = await request(app)
      .post('/api/v1/profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ subject_type: 'SELF' });

    expect(res.status).toBe(201);
    expect(res.body.subject_type).toBe('SELF');
    expect(res.body.status).toBe('DRAFT');
    expect(res.body.owner_user_id).toBe(userId);
  });

  it('should create a SOMEONE_ELSE profile draft', async () => {
    const res = await request(app)
      .post('/api/v1/profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ subject_type: 'SOMEONE_ELSE' });

    expect(res.status).toBe(201);
    expect(res.body.subject_type).toBe('SOMEONE_ELSE');
  });

  it('should update profile and handle UNKNOWN income', async () => {
    const createRes = await request(app)
      .post('/api/v1/profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ subject_type: 'SELF' });
    const profileId = createRes.body._id;

    const res = await request(app)
      .patch(`/api/v1/profiles/${profileId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        annual_family_income: { value: null, status: 'UNKNOWN' }
      });

    expect(res.status).toBe(200);
    expect(res.body.annual_family_income.status).toBe('UNKNOWN');
    expect(res.body.annual_family_income.value).toBeNull();
  });

  it('should validate negative age', async () => {
    const createRes = await request(app)
      .post('/api/v1/profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ subject_type: 'SELF' });

    const res = await request(app)
      .patch(`/api/v1/profiles/${createRes.body._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        age: { value: -5, status: 'KNOWN' }
      });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain('Validation failed: Age cannot be negative');
  });

  it('should prevent User B from accessing User A profile', async () => {
    const createRes = await request(app)
      .post('/api/v1/profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ subject_type: 'SELF' });

    const profileId = createRes.body._id;

    const res = await request(app)
      .get(`/api/v1/profiles/${profileId}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(res.status).toBe(404); // User B cannot find User A's profile
  });

  it('should restore latest draft', async () => {
    await request(app)
      .post('/api/v1/profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ subject_type: 'SELF' });

    const currentRes = await request(app)
      .get('/api/v1/profiles/current')
      .set('Authorization', `Bearer ${token}`);

    expect(currentRes.status).toBe(200);
    expect(currentRes.body.subject_type).toBe('SELF');
  });

  it('should protect against NoSQL injection', async () => {
    const createRes = await request(app)
      .post('/api/v1/profiles')
      .set('Authorization', `Bearer ${token}`)
      .send({ subject_type: 'SELF' });

    // Try to update all profiles using injection in the ID
    const res = await request(app)
      .patch(`/api/v1/profiles/${{ $ne: null }}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        age: { value: 99, status: 'KNOWN' }
      });

    // Mongoose ObjectId cast will fail or query will fail
    expect(res.status).toBe(500);
  });
});
