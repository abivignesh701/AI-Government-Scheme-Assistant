import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';

let token: string;
let profileId: string;

jest.setTimeout(30000);

beforeAll(async () => {
  const uri = 'mongodb://127.0.0.1:27017/arogyasathi_test_' + Math.random().toString(36).substring(7);

  process.env.MONGODB_URI = uri;
  process.env.JWT_SECRET = 'test-secret';
  await mongoose.connect(uri);

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

describe('Eligibility Explanation API', () => {
  
  it('should generate explanations with matched/failed/unknown conditions and benefits', async () => {
    const res = await request(app)
      .get(`/api/v1/profiles/${profileId}/explanations`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const result = res.body;
    expect(result.explanations).toBeDefined();
    
    // Check NEEDS_MORE_INFORMATION scheme
    const s1 = result.explanations.find((e: any) => e.scheme_id === 'scheme_1');
    expect(s1.status).toBe('NEEDS_MORE_INFORMATION');
    expect(s1.unknown_conditions.length).toBeGreaterThan(0);
    expect(s1.benefits.length).toBe(1);
    expect(s1.benefits[0].category).toBe('FINANCIAL_COVERAGE');

    const s3 = result.explanations.find((e: any) => e.scheme_id === 'scheme_3');
    expect(s3.verification_requirements.length).toBe(1);
    expect(s3.verification_requirements[0].status).toBe('OFFICIAL_VERIFICATION_REQUIRED');
  });

  it('should get detailed scheme information', async () => {
    const res = await request(app)
      .get(`/api/v1/schemes/scheme_1`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.scheme_id).toBe('scheme_1');
    expect(res.body.benefits.length).toBe(1);
    expect(res.body.documents.length).toBe(1);
  });

});
