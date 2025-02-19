const request = require('supertest');
const app = require('../app'); // Ensure the correct path to your Express app
const { HealthCheck, sequelize } = require('../Entities');

describe('Health Check API Tests', () => {
  
   /* test('✅ Valid GET request to /healthz should return 200 OK', async () => {
     const res = await request(app).get('/healthz');
     expect(res.status).toBe(200);
   }); */
  test('✅ Valid GET request to /healthz should return 200 OK', async () => {
     // Mock successful database insert
    jest.spyOn(HealthCheck, 'create').mockResolvedValue({ checkId: 1, datetime: new Date() });

    const res = await request(app).get('/healthz');
    expect(res.status).toBe(200);
  });

  test('❌ GET request with empty JSON body should return 400 Bad Request', async () => {
    const res = await request(app).get('/healthz').send({});
    expect(res.status).toBe(400);
  });

  test('❌ GET request with non-empty JSON body should return 400 Bad Request', async () => {
    const res = await request(app).get('/healthz').send({ key: "value" });
    expect(res.status).toBe(400);
  });

  test('❌ PUT request to /healthz should return 405 Method Not Allowed', async () => {
    const res = await request(app).put('/healthz');
    expect(res.status).toBe(405);
  });

  test('❌ POST request to /healthz should return 405 Method Not Allowed', async () => {
    const res = await request(app).post('/healthz');
    expect(res.status).toBe(405);
  });

  test('❌ DELETE request to /healthz should return 405 Method Not Allowed', async () => {
    const res = await request(app).delete('/healthz');
    expect(res.status).toBe(405);
  });

  test('❌ PATCH request to /healthz should return 405 Method Not Allowed', async () => {
    const res = await request(app).patch('/healthz');
    expect(res.status).toBe(405);
  });

  test('❌ Invalid URL (/healthzzzz) should return 404 Not Found', async () => {
    const res = await request(app).get('/healthzzzz');
    expect(res.status).toBe(404);
  });

  test('❌ GET request with unexpected query parameters should return 400 Bad Request', async () => {
    const res = await request(app).get('/healthz?status=ok');
    expect(res.status).toBe(400);
  });

  //  test('❌ Database unavailable should return 503 Service Unavailable', async () => {
  //   // Simulate database failure by making `HealthCheck.create` throw an error
  //   jest.spyOn(HealthCheck, 'create').mockRejectedValue(new Error('Database Unavailable'));

  //   const res = await request(app).get('/healthz');
  //   expect(res.status).toBe(503);
  // });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore original implementations after each test
  });
  afterAll(async () => {
    await sequelize.close();
  });

});
