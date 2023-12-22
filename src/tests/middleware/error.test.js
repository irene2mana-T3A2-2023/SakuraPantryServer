import request from 'supertest';
import app from '../../server.js';
import Category from '../../models/CategoryModel.js';
import { envConfig } from '../../configs/env.js';

// Test suite for errors handling middleware
describe('Global Error Handler Middleware', () => {
  beforeEach(async () => {
    await Category.deleteMany({});
    await Category.create({ name: 'Test Category', slug: 'test-category' });
  });

  afterEach(async () => {
    await Category.deleteMany({});
  });

  // Test case 1: CastError
  it('Should handle CastError and return a 500 Internal Server Error response', async () => {
    const invalidId = 'invalid-id';

    const res = await request(app)
      .get(`/api/orders/${invalidId}`)
      .set('Authorization', `Bearer ${global.mockUsers.adminToken}`)
      .set('Accept', 'application/json');

    expect(res.statusCode).toEqual(500);
    expect(res.body.error.name).toEqual('CastError');
    expect(res.body.message).toMatch(
      /Cast to ObjectId failed for value ".+" \(type string\) at path "_id" for model ".+"/
    );
  });

  // Test case 2: ValidationError - Test the response in different environments
  if (envConfig.env === 'development') {
    it('Should handle ValidationError and return full error details in response', async () => {
      const invalidProductData = {
        name: '', // product name is required
        description: 'This is a description for test product.',
        categorySlug: 'test-category',
        imageUrl: 'testImageURL.png',
        stockQuantity: 20,
        price: '', // product price is required
        isFeatured: true
      };

      const res = await request(app)
        .post(`/api/products`)
        .send(invalidProductData)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`)
        .set('Accept', 'application/json');

      expect(res.statusCode).toEqual(500);
      expect(res.body.error.name).toEqual('ValidationError');
      expect(res.body.error._message).toEqual('Product validation failed');
      expect(res.body).toHaveProperty('stack');
    });
  }

  if (envConfig.env === 'production') {
    it('Should handle ValidationError and return generic error message in response', async () => {
      const invalidProductData = {
        name: '', // product name is required
        description: 'This is a description for test product.',
        categorySlug: 'test-category',
        imageUrl: 'testImageURL.png',
        stockQuantity: 20,
        price: '', // product price is required
        isFeatured: true
      };

      const res = await request(app)
        .post(`/api/products`)
        .send(invalidProductData)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`)
        .set('Accept', 'application/json');

      expect(res.statusCode).toEqual(500);
      expect(res.body.status).toEqual('error');
      expect(res.body.message).toEqual('Something went wrong!');
      expect(res.body).not.toHaveProperty('stack');
    });
  }
});
