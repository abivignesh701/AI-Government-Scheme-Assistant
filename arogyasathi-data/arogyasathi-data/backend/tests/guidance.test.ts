import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';

let token: string;
let profileId: string;
let trackingId: string;

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

describe('Application Guidance & Tracking API', () => {
  
  it('should fetch scheme guidance', async () => {
    const res = await request(app)
      .get(`/api/v1/schemes/scheme_1/guidance`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.documents).toBeDefined();
    expect(res.body.steps).toBeDefined();
    expect(res.body.channels).toBeDefined();
  });

  it('should start tracking', async () => {
    const res = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        profile_id: profileId,
        scheme_id: 'scheme_1',
        evaluation_id: 'mock_eval_id'
      });

    expect(res.status).toBe(200);
    expect(res.body.state).toBe('NOT_STARTED');
    trackingId = res.body._id;
  });

  it('should prevent duplicate tracking', async () => {
    const res = await request(app)
      .post('/api/v1/applications')
      .set('Authorization', `Bearer ${token}`)
      .send({
        profile_id: profileId,
        scheme_id: 'scheme_1',
        evaluation_id: 'mock_eval_id'
      });

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(trackingId); // Should return existing
  });

  it('should update tracking state', async () => {
    const res = await request(app)
      .patch(`/api/v1/applications/${trackingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ state: 'PREPARING_DOCUMENTS' });

    expect(res.status).toBe(200);
    expect(res.body.state).toBe('PREPARING_DOCUMENTS');
  });

  it('should reject invalid tracking state', async () => {
    const res = await request(app)
      .patch(`/api/v1/applications/${trackingId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ state: 'APPROVED' }); // Not allowed

    expect(res.status).toBe(400);
  });

  it('should update checklist', async () => {
    const res = await request(app)
      .post(`/api/v1/applications/${trackingId}/checklist`)
      .set('Authorization', `Bearer ${token}`)
      .send({ doc_id: 'doc1', status: 'HAVE' });

    expect(res.status).toBe(200);
    expect(res.body.checklist_state.doc1).toBe('HAVE');
  });

});
