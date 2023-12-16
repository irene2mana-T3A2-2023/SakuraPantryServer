import request from 'supertest';
import app from '../../server.js';

const registerEndpoint = '/api/auth/register';

describe('Authentication-related APIs', () => {
  describe(`[POST] ${registerEndpoint}`, () => {
    it('Should raise an error when one of required fields is missing', async () => {
      const newUser = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      };

      const res = await request(app).post(registerEndpoint).send(newUser);

      expect(res.statusCode).toBe(400);
    });

    it('Should raise an error when password and confirmPassword do not matched', async () => {
      const newUser = {
        firstName: 'John',
        lastName: 'Lenon',
        email: 'john@test.com',
        password: 'password',
        confirmPassword: 'password1'
      };

      const res = await request(app).post(registerEndpoint).send(newUser);

      expect(res.statusCode).toBe(400);
    });

    it('Should raise an error when registering with an invalid password', async () => {
      const newUser = {
        firstName: 'John',
        lastName: 'Lenon',
        email: 'john@test.com',
        password: 'p@ ssword',
        confirmPassword: 'p@ ssword'
      };

      const res = await request(app).post(registerEndpoint).send(newUser);

      expect(res.statusCode).toBe(400);
    });

    it('Should register successfully', async () => {
      const newUser = {
        firstName: 'John',
        lastName: 'Lenon',
        email: 'john@test.com',
        password: 'password',
        confirmPassword: 'password'
      };

      const res = await request(app).post(registerEndpoint).send(newUser);

      expect(res.statusCode).toBe(200);
    });

    it('Should raise an error when attempting to register with a duplicated email', async () => {
      const newUser = {
        firstName: 'Johntest',
        lastName: 'Lenontest',
        email: 'john@test.com',
        password: 'password',
        confirmPassword: 'password'
      };

      const res = await request(app).post(registerEndpoint).send(newUser);

      expect(res.statusCode).toBe(400);
    });
  });
});
