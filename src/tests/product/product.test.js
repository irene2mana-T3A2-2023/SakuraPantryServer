import request from 'supertest';
import app from '../../server.js';

const relativeProductsEndpoint = '/api/products/relative-products';
const newArrivalProductsEndpoint = '/api/products/new-arrivals';
const featuredProductsEndpoint = '/api/products/feature';
const searchProductsEndpoint = '/api/products/search';

// Test cases for relativeProductsByCategory route
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
  // Test cases for getNewArrivalProducts route
  describe(`[GET] ${newArrivalProductsEndpoint}`, () => {
    it('Should return the latest 5 products whenre there are at least 5 new arrivals', async () => {
      const res = await request(app).get(`${newArrivalProductsEndpoint}/`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(5);
    });
  });
  // Test cases for getFeatureProducts route
  describe(`[GET] ${featuredProductsEndpoint}`, () => {
    it('Should return 5 featured products when there are at least 5 featured products', async () => {
      const res = await request(app).get(`${featuredProductsEndpoint}/`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(5);
    });
  });
  // Test cases for searchProduct route
  describe(`[GET] ${searchProductsEndpoint}`, () => {
    it('Should return paginated search results for products with names or descriptions containing with keyword m', async () => {
      const keyword = 'm';
      const page = 1;
      const limit = 8;

      const res = await request(app).get(
        `${searchProductsEndpoint}/?k=${keyword}&c=&page=${page}&limit=${limit}`
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('totalResults');
      expect(res.body).toHaveProperty('totalPages');
      expect(res.body).toHaveProperty('currentPage', page);
      expect(res.body.results).toHaveLength(limit);
    });

    it('Should return an empty array when an invalid keyword or category slug is provided', async () => {
      const invalidKeyword = 'nonExistentKeyword';
      const invalidCategorySlug = 'nonExistentSlug';
      const page = 1;
      const limit = 8;

      const res = await request(app).get(
        `${searchProductsEndpoint}/?k=${invalidKeyword}&c=${invalidCategorySlug}&page=${page}&limit=${limit}`
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body.results).toHaveLength(0);
    });

    it('Should filter products by the specified category', async () => {
      const validCategorySlug = 'sauces-seasonings';
      const page = 1;
      const limit = 8;

      const res = await request(app).get(
        `${searchProductsEndpoint}/?c=${validCategorySlug}&page=${page}&limit=${limit}`
      );

      expect(res.statusCode).toEqual(200);
      expect(res.body.results).not.toHaveLength(0);

      res.body.results.forEach((product) => {
        expect(product.category.slug).toEqual(validCategorySlug);
      });
    });
  });
});
