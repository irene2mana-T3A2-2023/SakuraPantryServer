import request from 'supertest';
import app from '../../server.js';

const relativeProductsEndpoint = '/api/products/relative-products';

describe('Product related APIs', () => {
  describe(`[GET] ${relativeProductsEndpoint}`, () => {
    it('Should return an empty array when an incorrect category slug is provided', async () => {
      const res = await request(app).get(`${relativeProductsEndpoint}/not-existing-category-slug`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });

    it('Should return related products when a valid category slug provided', async () => {
      const res = await request(app).get(`${relativeProductsEndpoint}/drinks-sake`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(5);
    });
  });
});
