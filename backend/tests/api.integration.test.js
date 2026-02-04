const request = require('supertest');
const app = require('../src/app');
const { db } = require('../src/config/database');

// Run migrations before tests, destroy DB after
beforeAll(async () => {
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

describe('Health Check', () => {
  test('GET /api/health returns healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('Senzwa MigrateSA API');
  });
});

describe('Auth Routes', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'TestPassword123',
    firstName: 'Test',
    lastName: 'User',
  };
  let authToken;

  test('POST /api/auth/register creates a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
    authToken = res.body.token;
  });

  test('POST /api/auth/register rejects duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(409);
  });

  test('POST /api/auth/register rejects invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, email: 'not-an-email' });
    expect(res.statusCode).toBe(400);
  });

  test('POST /api/auth/login returns token for valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    authToken = res.body.token;
  });

  test('POST /api/auth/login rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'WrongPassword' });
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/auth/me returns user with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
  });

  test('GET /api/auth/me rejects without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});

describe('Knowledge Routes (Public)', () => {
  test('GET /api/knowledge/overview returns data', async () => {
    const res = await request(app).get('/api/knowledge/overview');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/knowledge/visa-categories returns categories', async () => {
    const res = await request(app).get('/api/knowledge/visa-categories');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/knowledge/critical-skills returns skills list', async () => {
    const res = await request(app).get('/api/knowledge/critical-skills');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/knowledge/fees returns fee schedule', async () => {
    const res = await request(app).get('/api/knowledge/fees');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/knowledge/processing-times returns times', async () => {
    const res = await request(app).get('/api/knowledge/processing-times');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/knowledge/faq returns FAQ', async () => {
    const res = await request(app).get('/api/knowledge/faq');
    expect(res.statusCode).toBe(200);
  });
});

describe('Visa Routes', () => {
  test('GET /api/visas/categories returns all categories', async () => {
    const res = await request(app).get('/api/visas/categories');
    expect(res.statusCode).toBe(200);
  });

  test('GET /api/visas/groups returns visa groups', async () => {
    const res = await request(app).get('/api/visas/groups');
    expect(res.statusCode).toBe(200);
  });
});

describe('Conversation Routes', () => {
  test('POST /api/conversation/message returns AI response', async () => {
    const res = await request(app)
      .post('/api/conversation/message')
      .send({ message: 'What visas are available?' });
    expect(res.statusCode).toBe(200);
    expect(res.body.response).toBeDefined();
    expect(res.body.response.text).toBeDefined();
    expect(res.body.timestamp).toBeDefined();
  });

  test('POST /api/conversation/message rejects empty message', async () => {
    const res = await request(app)
      .post('/api/conversation/message')
      .send({ message: '' });
    expect(res.statusCode).toBe(400);
  });

  test('GET /api/conversation/suggestions returns suggestions', async () => {
    const res = await request(app).get('/api/conversation/suggestions');
    expect(res.statusCode).toBe(200);
    expect(res.body.suggestions).toBeDefined();
    expect(Array.isArray(res.body.suggestions)).toBe(true);
  });
});

describe('Eligibility Routes', () => {
  let authToken;

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({
      email: 'eligtest@example.com',
      password: 'TestPassword123',
      firstName: 'Elig',
      lastName: 'Tester',
    });
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'eligtest@example.com',
      password: 'TestPassword123',
    });
    authToken = loginRes.body.token;
  });

  test('POST /api/eligibility/evaluate returns eligibility assessment', async () => {
    const profile = {
      nationality: 'Nigerian',
      purposeOfStay: 'work',
      passportNumber: 'A12345678',
      passportExpiry: '2028-06-15',
      hasJobOffer: true,
      financialStanding: { monthlyIncome: 50000 },
    };
    const res = await request(app)
      .post('/api/eligibility/evaluate')
      .set('Authorization', `Bearer ${authToken}`)
      .send(profile);
    expect(res.statusCode).toBe(200);
  });

  test('POST /api/eligibility/evaluate rejects without auth', async () => {
    const res = await request(app)
      .post('/api/eligibility/evaluate')
      .send({ nationality: 'Nigerian' });
    expect(res.statusCode).toBe(401);
  });
});
