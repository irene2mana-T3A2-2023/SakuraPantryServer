/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import request from 'supertest';
import app from '../../server.js';
import { envConfig } from '../../configs/env.js';
import { jest } from '@jest/globals';

const relativeProductsEndpoint = '/api/products/relative-products';
const getAllProductsEndpoint = '/api/products';
const getProductBySlugEndpoint = '/api/products';
const createProductEndpoint = '/api/products';
const updateProductBySlugEndpoint = '/api/products';
const deleteProductBySlugEndpoint = '/api/products';


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
    // it('Should return a 404 Not Found error object when a wrong URL is provided', async () => {
    //   const res = await request(app).get(`${getAllProductsEndpoint}wrong-URL`);

    //   expect(res.error.statusCode).toEqual(404);
    //   expect(res.body).toHaveProperty(
    //     'message',
    //     `Can't find /api/productswrong-URL on this server!`
    //   );
    // });

    it('Should return a list of all products in database when a valid URL is provided', async () => {
      const res = await request(app).get(`${getAllProductsEndpoint}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(20);
    });
  });

  describe(`GET] ${getProductBySlugEndpoint}`, () => {
      // it('Should return an empty array when an incorrect product slug is provided', async () => {
      //   const res = await request(app).get(`${getProductBySlugEndpoint}/not-existing-product-slug`);

      //   expect(res.body.error.statusCode).toEqual(404);
      //   expect(res.body.message).toEqual('Product not found')
      // });

    it('Should return the product with corresponding slug when a correct slug provided', async () => {
      const validSlug = 'miso-paste';

      const res = await request(app).get(`${getProductBySlugEndpoint}/${validSlug}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(false);
      expect(typeof res.body).toBe('object');
      expect(res.body).toHaveProperty('slug', validSlug);
    });
    // });

    describe(`[POST] ${createProductEndpoint}`, () => {
      it('Should return a new product object in JSON format', async () => {
        const requestBody = {
          name: 'Red Miso',
          description: 'This is a description for red miso product.',
          categorySlug: 'miso-paste',
          imageUrl: '',
          stockQuantiy: 20,
          price: 5.3,
          isFeatured: true
        };

        const res = await request(app)
          .post(createProductEndpoint)
          .send(requestBody)
          .set('Authorization', `Bearer ${global.mockUsers.adminToken}`)
          .set('Accept', 'application/json')
        
        expect(res.statusCode).toEqual(201);
      });
    });
  });
});
