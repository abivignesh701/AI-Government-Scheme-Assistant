import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server';
import { CitizenProfile } from '../app/models/CitizenProfile';
import path from 'path';
import fs from 'fs';

let token: string;
let profileId: string;

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

  // Create Profile
  const profileRes = await request(app)
    .post('/api/v1/profiles')
    .set('Authorization', `Bearer ${token}`)
    .send({ subject_type: 'SELF' });
  profileId = profileRes.body._id;

  // Ensure uploads directory exists
  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoose.connection.db) { await mongoose.connection.db.dropDatabase(); }
});

describe('Document Upload API', () => {
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    fetchMock = jest.spyOn(global, 'fetch').mockImplementation(async () => {
      return {
        ok: true,
        json: async () => ({
          document_id: '123',
          document_type: 'INCOME_CERTIFICATE',
          fields: [
            { field: 'annual_family_income', value: 120000, display_value: '₹1,20,000', needs_confirmation: true }
          ]
        })
      } as any;
    });
  });

  afterEach(() => {
    fetchMock.mockRestore();
  });

  it('should reject invalid file types', async () => {
    const res = await request(app)
      .post(`/api/v1/profiles/${profileId}/documents/extract`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.from('fake data'), { filename: 'test.txt', contentType: 'text/plain' });

    expect(res.status).toBe(500); // Multer throws error caught by Express
  });

  it('should successfully forward valid PDF to AI service and return structured data', async () => {
    // Create dummy PDF
    const testFilePath = path.join(__dirname, 'test.pdf');
    fs.writeFileSync(testFilePath, 'dummy pdf content');

    const res = await request(app)
      .post(`/api/v1/profiles/${profileId}/documents/extract`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', testFilePath);

    fs.unlinkSync(testFilePath);

    expect(res.status).toBe(200);
    expect(res.body.document_type).toBe('INCOME_CERTIFICATE');
    expect(res.body.fields[0].value).toBe(120000);
    expect(fetchMock).toHaveBeenCalled();
  });

  it('should secure profile ownership', async () => {
    // User B tries to upload to User A's profile
    const signupRes = await request(app).post('/api/v1/auth/signup').send({
      name: 'User B',
      email: 'userb@example.com',
      password: 'password123'
    });
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: 'userb@example.com',
      password: 'password123'
    });
    const tokenB = loginRes.body.token;

    const testFilePath = path.join(__dirname, 'test2.pdf');
    fs.writeFileSync(testFilePath, 'dummy pdf content');

    const res = await request(app)
      .post(`/api/v1/profiles/${profileId}/documents/extract`)
      .set('Authorization', `Bearer ${tokenB}`)
      .attach('file', testFilePath);

    fs.unlinkSync(testFilePath);

    expect(res.status).toBe(404); // Not found or access denied
  });

  it('should handle AI service failure gracefully', async () => {
    fetchMock.mockImplementationOnce(async () => {
      return {
        ok: false,
        statusText: 'Internal Server Error',
        text: async () => 'Error'
      } as any;
    });

    const testFilePath = path.join(__dirname, 'test3.pdf');
    fs.writeFileSync(testFilePath, 'dummy pdf content');

    const res = await request(app)
      .post(`/api/v1/profiles/${profileId}/documents/extract`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', testFilePath);

    fs.unlinkSync(testFilePath);

    expect(res.status).toBe(500);
    expect(res.body.error.message).toBe('Failed to process document');
  });
});
