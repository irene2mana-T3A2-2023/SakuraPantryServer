import request from 'supertest';
import app from '../../server.js';
import Category from '../../models/CategoryModel.js';
import Product from '../../models/ProductModel.js';

const relativeProductsEndpoint = '/api/products/relative-products';
const getAllProductsEndpoint = '/api/products';
const getProductBySlugEndpoint = '/api/products';
const createProductEndpoint = '/api/products';
const updateProductBySlugEndpoint = '/api/products';
const deleteProductBySlugEndpoint = '/api/products';

// Test suite for Product API
describe('Product API', () => {
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
      expect(Array.isArray(res.body)).toEqual(true);
      expect(res.body.length).toBeGreaterThanOrEqual(20);
    });
  });

  // Test cases for getProductBySlug route
  describe(`GET] ${getProductBySlugEndpoint}`, () => {
    it('should return a 404 Not Found error for a non-existing product slug', async () => {
      const nonExistingSlug = 'non-existing-slug';
      const res = await request(app).get(`/api/products/${nonExistingSlug}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Product not found');
    });

    it('Should return the product with corresponding slug when a correct slug provided', async () => {
      const validSlug = 'miso-paste';

      const res = await request(app).get(`${getProductBySlugEndpoint}/${validSlug}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(false);
      expect(typeof res.body).toEqual('object');
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
    it('Should return a duplicate fields error when creating a product with existing data', async () => {
      const existingProductData = {
        name: 'Test Product', // product name can not be duplicated
        description: 'This is a description for test product.',
        categorySlug: 'test-category',
        imageUrl: 'testImageURL.png', // imageUrl can not be duplicated
        stockQuantity: 20,
        price: 5.3,
        isFeatured: true
      };

      const res = await request(app)
        .post(createProductEndpoint)
        .send(existingProductData)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`)
        .set('Accept', 'application/json');

      expect(res.body.error.statusCode).toEqual(409);
      expect(res.body).toHaveProperty('error');
      expect(res.body).toHaveProperty(
        'message',
        'Product with the same name or slug already exists'
      );
    });

    // Test case 3
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

    // Test case 4
    it('Should return an error if the category does not exist', async () => {
      const invalidRequestBody = {
        name: 'Another Test Product',
        description: 'This is a description for another test product.',
        categorySlug: 'not-existing-test-category',
        imageUrl: 'anotherTestImageURL.png',
        stockQuantity: 20,
        price: '',
        isFeatured: true
      };

      const res = await request(app)
        .post(createProductEndpoint)
        .send(invalidRequestBody)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`)
        .set('Accept', 'application/json');

      expect(res.body.error.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error');
      expect(res.body).toHaveProperty('message', 'No such category exists!');
    });
  });

  // Test cases for updateProduct route
  describe(`[PATCH] ${updateProductBySlugEndpoint}`, () => {
    beforeEach(async () => {
      await Category.deleteMany({});
      await Category.create({ name: 'Test Category', slug: 'test-category' });
    });

    afterEach(async () => {
      await Category.deleteMany({});
      await Product.deleteMany({});
    });

    const createTestProduct = async () => {
      return await Product.create({
        name: 'Test Product',
        description: 'This is a description for test product',
        category: {
          _id: '657046215ed01f56e0a4e00b',
          name: 'Test Category',
          slug: 'test-category'
        },
        slug: 'test-product',
        price: 5.5
      });
    };

    // Test case 1
    it('Should return a 404 Not Found error for a non-existing product slug', async () => {
      const nonExistingSlug = 'non-existing-slug';
      const res = await request(app)
        .patch(`/api/products/${nonExistingSlug}`)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Product not found');
    });

    // Test case 2
    it('Should update an existing product and return the updated product', async () => {
      // Create a test product
      const testProduct = await createTestProduct();

      // Updated product data
      const updatedProductData = {
        name: 'Test Product',
        description: 'This is an updated description for test product',
        price: 4.5
      };

      const res = await request(app)
        .patch(`/api/products/${testProduct.slug}`)
        .send(updatedProductData)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`)
        .set('Accept', 'application/json');

      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toEqual(testProduct.name);
      expect(res.body.description).toEqual(updatedProductData.description);
      expect(res.body.price).toEqual(updatedProductData.price);
    });
  });

  // Test cases for deleteProduct route
  describe(`[PATCH] ${deleteProductBySlugEndpoint}`, () => {
    beforeEach(async () => {
      await Category.deleteMany({});
      await Category.create({ name: 'Test Category', slug: 'test-category' });
    });

    afterEach(async () => {
      await Category.deleteMany({});
      await Product.deleteMany({});
    });

    const createTestProduct = async () => {
      return await Product.create({
        name: 'Test Product',
        description: 'This is a description for test product',
        category: {
          _id: '657046215ed01f56e0a4e00b',
          name: 'Test Category',
          slug: 'test-category'
        },
        slug: 'test-product',
        price: 5.5
      });
    };

    // Test case 1
    it('Should return a 404 Not Found error for a non-existing product slug', async () => {
      const nonExistingSlug = 'non-existing-slug';
      const res = await request(app)
        .delete(`/api/products/${nonExistingSlug}`)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Product not found');
    });

    // Test case 2
    it('Should delete a product and return a message of successful deletion', async () => {
      // Create a test product
      const testProduct = await createTestProduct();

      const res = await request(app)
        .delete(`/api/products/${testProduct.slug}`)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual('Product successfully deleted');

      // Ensure the product is no longer in the database
      const deletedProduct = await Product.findOne({ slug: testProduct.slug });
      expect(deletedProduct).toBeNull();
    });
  });
});
