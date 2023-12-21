import request from 'supertest';
import app from '../../server.js';
import Category from '../../models/CategoryModel.js';
import Product from '../../models/ProductModel.js';

const getAllCategoriesEndpoint = '/api/categories';
const createCategoryEndpoint = '/api/categories';
const updateCategoryEndpoint = '/api/categories';
const deleteCategoryEndpoint = '/api/categories';

// Test suite for Categories API
describe('Categories API', () => {
  // Test cases for getAllCategories route
  describe(`[GET] ${getAllCategoriesEndpoint}`, () => {
    it('Should return a 404 Not Found error object when a wrong URL is provided', async () => {
      const res = await request(app).get(`${getAllCategoriesEndpoint}wrong-URL`);

      expect(res.body.error.statusCode).toEqual(404);
      expect(res.body).toHaveProperty(
        'message',
        `Can't find /api/categorieswrong-URL on this server!`
      );
    });

    it('Should return a list of all categories in database when a valid URL is provided', async () => {
      const res = await request(app).get(`${getAllCategoriesEndpoint}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.length).toBeGreaterThanOrEqual(5);
    });
  });

  // Test cases for createCategory route
  describe(`[POST] ${createCategoryEndpoint}`, () => {
    afterEach(async () => {
      await Category.deleteMany({});
    });

    const createTestCategory = async () => {
      return await Category.create({
        name: 'Test Category',
        slug: 'test-category'
      });
    };

    // Test case 1
    it('Should return a new category object in JSON format', async () => {
      const requestBody = {
        name: 'Test Category'
      };

      const res = await request(app)
        .post(createCategoryEndpoint)
        .send(requestBody)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`)
        .set('Accept', 'application/json');

      expect(res.statusCode).toEqual(201);
    });

    // Test case 2
    it('Should return a duplicate fields error when creating a product with existing data', async () => {
      // Create a test category
      await createTestCategory();

      const existingCategoryData = {
        name: 'Test Category', // category name can not be duplicated
        slug: 'test-category' // category slug can not be duplicated
      };

      const res = await request(app)
        .post(createCategoryEndpoint)
        .send(existingCategoryData)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`)
        .set('Accept', 'application/json');

      expect(res.body.error.statusCode).toEqual(409);
      expect(res.body).toHaveProperty('error');
      expect(res.body).toHaveProperty(
        'message',
        'Category with the same name or slug already exists'
      );
    });
  });

  // Test cases for updateCategory route
  describe(`[PATCH] ${updateCategoryEndpoint}`, () => {
    afterEach(async () => {
      await Category.deleteMany({});
    });

    const createTestCategory = async () => {
      return await Category.create({
        name: 'Test Category',
        slug: 'test-category'
      });
    };

    // Test case 1
    it('Should return a 404 Not Found error for a non-existing category slug', async () => {
      const nonExistingSlug = 'non-existing-slug';
      const res = await request(app)
        .patch(`${updateCategoryEndpoint}/${nonExistingSlug}`)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Category not found');
    });

    // Test case 2
    it('Should update an existing product and return the updated product', async () => {
      // Create a test category
      const testCategory = await createTestCategory();

      // Updated category data
      const updatedCategoryData = {
        name: 'Updated Test Category'
      };

      const res = await request(app)
        .patch(`${updateCategoryEndpoint}/${testCategory.slug}`)
        .send(updatedCategoryData)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`)
        .set('Accept', 'application/json');

      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual(updatedCategoryData.name);
    });
  });

  // Test cases for deleteCategory route
  describe(`[PATCH] ${deleteCategoryEndpoint}`, () => {
    afterEach(async () => {
      await Category.deleteMany({});
    });

    const createTestCategory = async () => {
      return await Category.create({
        name: 'Test Category',
        slug: 'test-category'
      });
    };

    // Test case 1
    it('Should return a 404 Not Found error for a non-existing product slug', async () => {
      const nonExistingSlug = 'non-existing-slug';
      const res = await request(app)
        .delete(`${updateCategoryEndpoint}/${nonExistingSlug}`)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Category not found');
    });

    // Test case 2
    it('Should delete a product and return a message of successful deletion', async () => {
      // Create a test category
      const testCategory = await createTestCategory();

      const res = await request(app)
        .delete(`${updateCategoryEndpoint}/${testCategory.slug}`)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Category successfully deleted');

      // Ensure the category is no longer in the database
      const deletedCategory = await Product.findOne({ slug: testCategory.slug });
      expect(deletedCategory).toBeNull();
    });
  });
});
