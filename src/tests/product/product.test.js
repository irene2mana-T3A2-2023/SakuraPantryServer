/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import request from 'supertest';
import app from '../../server.js';
import { envConfig } from '../../configs/env.js';
import { jest } from '@jest/globals';
import Category from '../../models/CategoryModel.js';

const relativeProductsEndpoint = '/api/products/relative-products';
const getAllProductsEndpoint = '/api/products';
const getProductBySlugEndpoint = '/api/products';
const createProductEndpoint = '/api/products';
const updateProductBySlugEndpoint = '/api/products';
const deleteProductBySlugEndpoint = '/api/products';

describe('Product APIs', () => {
  // Test cases for getRelativeProducts route
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

  // Test cases for getAllProduct route
  describe(`[GET] ${getAllProductsEndpoint}`, () => {
    it('Should return a 404 Not Found error object when a wrong URL is provided', async () => {
      const res = await request(app).get(`${getAllProductsEndpoint}wrong-URL`);

      expect(res.body.error.statusCode).toEqual(404);
      expect(res.body).toHaveProperty(
        'message',
        `Can't find /api/productswrong-URL on this server!`
      );
    });

    it('Should return a list of all products in database when a valid URL is provided', async () => {
      const res = await request(app).get(`${getAllProductsEndpoint}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(20);
    });
  });

  // Test cases for getProductBySlug route
  describe(`GET] ${getProductBySlugEndpoint}`, () => {
    it('should return a 404 error for a non-existing product slug', async () => {
      const nonExistingSlug = 'non-existing-slug';
      const response = await request(app).get(`/api/products/${nonExistingSlug}`);

      expect(response.statusCode).toBe(404);
      expect(response.body.message).toBe('Product not found');
    });

    it('Should return the product with corresponding slug when a correct slug provided', async () => {
      const validSlug = 'miso-paste';

      const res = await request(app).get(`${getProductBySlugEndpoint}/${validSlug}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(false);
      expect(typeof res.body).toBe('object');
      expect(res.body).toHaveProperty('slug', validSlug);
    });
  });

  // Test cases for createProduct route
  describe(`[POST] ${createProductEndpoint}`, () => {
    beforeEach(async () => {
      await Category.deleteMany({});
      // Perform setup steps before each test
      // Insert a test category into the database
      await Category.create({ name: 'Test Category', slug: 'test-category' });
    });

    afterEach(async () => {
      // Clean up after each test
      // In this example, delete the sample category from the database
      await Category.deleteMany({});
    });

    // Test case 1
    it('Should return a new product object in JSON format', async () => {
      const requestBody = {
        name: 'Test Product',
        description: 'This is a description for test product.',
        categorySlug: 'test-category',
        imageUrl: 'testImageURL.png',
        stockQuantity: 20,
        price: 5.3,
        isFeatured: true
      };

      const res = await request(app)
        .post(createProductEndpoint)
        .send(requestBody)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`)
        .set('Accept', 'application/json');

      expect(res.statusCode).toEqual(201);
    });

    // Test case 2
    it('Should return a validation error when missing required fields', async () => {
      const invalidRequestBody = {
        name: '',
        description: 'This is a description for test product.',
        categorySlug: 'test-category',
        imageUrl: 'testImageURL.png',
        stockQuantity: 20,
        price: '',
        isFeatured: true
      };

      const res = await request(app)
        .post(createProductEndpoint)
        .send(invalidRequestBody)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`)
        .set('Accept', 'application/json');

      expect(res.body.error.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toHaveProperty('name', 'ValidationError');
    });
  });
});
