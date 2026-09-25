import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import { CitizenProfile } from '../app/models/CitizenProfile';

let token: string;
let profileId: string;
let tokenB: string;

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

  // Setup user B
  await request(app).post('/api/v1/auth/signup').send({
    name: 'User B',
    email: 'userb@example.com',
    password: 'password123'
  });
  const loginResB = await request(app).post('/api/v1/auth/login').send({
    email: 'userb@example.com',
    password: 'password123'
  });
  tokenB = loginResB.body.token;

  // Create Profile
  const profileRes = await request(app)
    .post('/api/v1/profiles')
    .set('Authorization', `Bearer ${token}`)
    .send({ subject_type: 'SELF' });
  profileId = profileRes.body._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoose.connection.db) { await mongoose.connection.db.dropDatabase(); }
});

describe('Smart Questions API', () => {
  
  it('should generate a question plan deduped and ordered by priority', async () => {
    const res = await request(app)
      .get(`/api/v1/profiles/${profileId}/questions`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const plan = res.body;
    expect(plan.questions.length).toBe(2);
    // annual_family_income impacts scheme_1 and scheme_2 (length = 2)
    // occupation impacts scheme_1 (length = 1)
    expect(plan.questions[0].field).toBe('annual_family_income'); // higher priority
    expect(plan.questions[1].field).toBe('occupation');
  });

  it('should reject unauthenticated access', async () => {
    const res = await request(app).get(`/api/v1/profiles/${profileId}/questions`);
    expect(res.status).toBe(401);
  });

  it('should enforce ownership on get plan', async () => {
    const res = await request(app)
      .get(`/api/v1/profiles/${profileId}/questions`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(res.status).toBe(404);
  });

  it('should answer question and update profile', async () => {
    const res = await request(app)
      .post(`/api/v1/profiles/${profileId}/questions/answer`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        field: 'annual_family_income',
        value: 150000,
        status: 'KNOWN'
      });

    expect(res.status).toBe(200);
    expect(res.body.evaluation).toBeDefined();
    expect(res.body.plan).toBeDefined();

    // Verify profile is updated
    const profileRes = await request(app)
      .get(`/api/v1/profiles/${profileId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(profileRes.body.annual_family_income.value).toBe(150000);
    expect(profileRes.body.annual_family_income.source).toBe('USER_CONFIRMED');
  });

  it('should handle UNKNOWN answer properly', async () => {
    const res = await request(app)
      .post(`/api/v1/profiles/${profileId}/questions/answer`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        field: 'occupation',
        value: null,
        status: 'UNKNOWN'
      });

    expect(res.status).toBe(200);
    const profileRes = await request(app)
      .get(`/api/v1/profiles/${profileId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(profileRes.body.occupation.status).toBe('UNKNOWN');
    expect(profileRes.body.occupation.value).toBeNull();
  });

  it('should reject invalid fields (allowlisting protection)', async () => {
    const res = await request(app)
      .post(`/api/v1/profiles/${profileId}/questions/answer`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        field: 'role',
        value: 'ADMIN',
        status: 'KNOWN'
      });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Invalid or restricted field');
  });
});
