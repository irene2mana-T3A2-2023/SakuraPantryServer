/* eslint-disable prettier/prettier */
import request from 'supertest';
import app from '../../server.js';

const getAllOrdersEndpoint = '/api/orders';

describe('Product APIs', () => {
  describe(`[GET] ${getAllOrdersEndpoint}`, () => {
    it('Should return a list of order with admin authorization', async () => {
      const res = await request(app)
        .get(getAllOrdersEndpoint)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
