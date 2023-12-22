import request from 'supertest';
import app from '../../server.js';

const getAllUsersEndpoint = '/api/users';

// Test suite for Users API
describe('Users API', () => {
  // Test cases for getAllUsers route
  describe(`[GET] ${getAllUsersEndpoint}`, () => {
    it('Should return a 404 Not Found error object when a wrong URL is provided', async () => {
      const res = await request(app).get(`${getAllUsersEndpoint}wrong-URL`);

      expect(res.body.error.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', `Can't find /api/userswrong-URL on this server!`);
    });

    it('Should return a list of all users in database when a valid URL is provided', async () => {
      const res = await request(app)
        .get(`${getAllUsersEndpoint}`)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`)
        .set('Accept', 'application/json');

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });
});
