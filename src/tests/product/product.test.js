import request from 'supertest';
import app from '../../server.js';

const relativeProductsEndpoint = '/api/products/relative-products';
const getAllProductsEndpoint = '/api/products';
const getProductBySlugEndpoint = '/api/products/miso-paste';
const createProductEndpoint = '/api/products';
const updateProductBySlugEndpoint = '/api/products/soy-sauce';
const deleteProductBySlugEndpoint = '/api/products/soy-sauce';

describe('Product APIs', () => {
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

  describe(`[GET] ${getAllProductsEndpoint}`, () => {
    it('Should return a 404 Not Found message when a wrong URL is provided', async () => {
      const res = await request(app).get(`${getAllProductsEndpoint}wrongURL`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual()
    });

    it('Should return a list of all products in database when a valid URL is provided', async () => {
      const res = await request(app).get(`${getAllProductsEndpoint}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(1);
    })

  })
});
