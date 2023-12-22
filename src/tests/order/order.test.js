import request from 'supertest';
import app from '../../server.js';
import Order from '../../models/OrderModel.js';
import Product from '../../models/ProductModel.js';
import Category from '../../models/CategoryModel.js';

const getAllOrdersEndpoint = '/api/orders';
const getMyOrdersEndpoint = '/api/orders/myorders';
const getOrderByIdEndpoint = '/api/orders';
const createOrderEndpoint = '/api/orders';
const updateOrderStatusEndpoint = '/api/orders';

// Test suite for Orders API
describe('Orders API', () => {
  let mockOrderId;
  let mockUserId;
  let mockCategory;
  let mockProduct;

  beforeEach(async () => {
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    // Getting mock user's id
    mockUserId = global.mockUsers.userId;

    // Insert a test category into the database before each test
    mockCategory = await Category.create({
      name: 'Test Category',
      slug: 'test-category'
    });

    // Insert a test product into the database before each test
    mockProduct = await Product.create({
      name: 'Test Product',
      slug: 'test-product',
      category: mockCategory._id,
      price: 5.5
    });

    // Insert a test order into the database before each test
    const mockOrders = [
      {
        shippingAddress: {
          address: '123 Main St.',
          city: 'Sydney',
          state: 'NSW',
          postcode: '3000'
        },
        phone: '012345678',
        user: mockUserId,
        orderItems: [
          {
            quantity: 2,
            product: '65802571f3aa90e83020cb68'
          },
          {
            quantity: 3,
            product: '65802571f3aa90e83020cb67'
          }
        ],
        totalPrice: 20.8,
        paymentMethod: 'Credit Card'
      }
    ];

    const insertedOrders = await Order.insertMany(mockOrders);
    mockOrderId = insertedOrders[0]._id.toString();
  });

  afterEach(async () => {
    // Clean up after each test
    // In this example, delete the sample order from the database
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
  });

  // Test cases for getAllOrders route
  describe(`[GET] ${getAllOrdersEndpoint}`, () => {
    it('Should return a list of order with admin authorization', async () => {
      const res = await request(app)
        .get(getAllOrdersEndpoint)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // Test cases for createOrder route
  describe(`[POST] ${createOrderEndpoint}`, () => {
    // Test case 1
    it('Should return a new order object in JSON format', async () => {
      const requestBody = {
        orderItems: [
          {
            quantity: 2,
            product: mockProduct._id
          }
        ],
        paymentMethod: 'PayPal',
        shippingAddress: {
          address: '123 Main St.',
          city: 'Sydney',
          state: 'NSW',
          postcode: '1234'
        },
        phone: '012345678',
        user: mockUserId
      };

      const res = await request(app)
        .post(createOrderEndpoint)
        .send(requestBody)
        .set('Authorization', `Bearer ${global.mockUsers.userToken}`)
        .set('Accept', 'application/json');

      expect(res.statusCode).toEqual(201);
    });

    // Test case 2
    it('Should return 404 Not Found errors when there is no order items', async () => {
      const invalidOrder = {
        orderItems: [], // empty cart
        paymentMethod: 'PayPal',
        shippingAddress: {
          address: '123 Main St.',
          city: 'Sydney',
          state: 'NSW',
          postcode: '1234'
        },
        phone: '012345678',
        user: mockUserId
      };

      const res = await request(app)
        .post(createOrderEndpoint)
        .send(invalidOrder)
        .set('Authorization', `Bearer ${global.mockUsers.userToken}`)
        .set('Accept', 'application/json');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('No order items');
    });
  });

  // Test cases for getMyOrders route
  describe(`[GET] ${getMyOrdersEndpoint}`, () => {
    it('Should return a list of orders belong to the user', async () => {
      const res = await request(app)
        .get(getMyOrdersEndpoint)
        .set('Authorization', `Bearer ${global.mockUsers.userToken}`)
        .set('Accept', 'application/json');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  // Test cases for getOrderById route
  // Test case 1
  describe(`[GET] ${getOrderByIdEndpoint}`, () => {
    it('Should return an order based on its ID', async () => {
      const res = await request(app)
        .get(`${getOrderByIdEndpoint}/${mockOrderId}`)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`)
        .set('Accept', 'application/json');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('_id', mockOrderId);
    });
  });

  // Test case 2
  describe(`[GET] ${getOrderByIdEndpoint}`, () => {
    it('Should return a 404 Not Found error for a non-existing order ID', async () => {
      const invalidId = 'invalid-id';

      const res = await request(app)
        .get(`${getOrderByIdEndpoint}/${invalidId}`)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`)
        .set('Accept', 'application/json');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Invalid order ID format');
    });
  });

  // Test case 3
  describe(`[GET] ${getOrderByIdEndpoint}`, () => {
    it('Should return a 404 Not Found error for a non-existing order ID', async () => {
      const nonExistingId = '757b0ccc5c46583917a8f489';

      const res = await request(app)
        .get(`${getOrderByIdEndpoint}/${nonExistingId}`)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`)
        .set('Accept', 'application/json');

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toEqual('Order not found');
    });
  });

  // Test cases for updateOrderStatus route
  describe(`[PATCH] ${updateOrderStatusEndpoint}`, () => {
    it('Should update order status with admin authorization', async () => {
      const validOrderId = mockOrderId;

      const updatedOrder = {
        status: 'Confirmed'
      };

      // eslint-disable-next-line no-console
      console.log(mockOrderId);

      const res = await request(app)
        .patch(`${updateOrderStatusEndpoint}/${validOrderId}/status`)
        .send(updatedOrder)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`)
        .set('Accept', 'application/json');

      expect(res.statusCode).toEqual(200);
      expect(res.body.status).toEqual(updatedOrder.status);
    });
  });
});
