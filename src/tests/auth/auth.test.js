import request from 'supertest';
import app from '../../server.js';
import { envConfig } from '../../configs/env.js';
import nodemailer from 'nodemailer';
import { jest } from '@jest/globals';

const registerEndpoint = '/api/auth/register';
const logInEndpoint = '/api/auth/login';
const forgotPasswordEndpoint = '/api/auth/forgot-password';

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

  describe(`[POST] ${logInEndpoint}`, () => {
    it('Should raise an error when one of the required fields is missing', async () => {
      const user = {
        email: '',
        password: ''
      };

      const res = await request(app).post(logInEndpoint).send(user);

      expect(res.statusCode).toBe(400);
    });

    describe('Should raise an error when login with invalid email or password', () => {
      it('Should raise an error when attempting to log in with an email that does not exist in the database', async () => {
        const user = {
          email: 'johnTest@test.com',
          password: 'password'
        };

        const res = await request(app).post(logInEndpoint).send(user);

        expect(res.statusCode).toBe(400);
      });

      it('Should raise an error when attempting to log in with a wrong password', async () => {
        const user = {
          email: 'john@test.com',
          password: 'passWord'
        };

        const res = await request(app).post(logInEndpoint).send(user);

        expect(res.statusCode).toBe(400);
      });
    });

    describe('Test expiration of token', () => {
      it('Should set expiresIn to 30d when rememberMe is true', async () => {
        const user = {
          email: 'john@test.com',
          password: 'password',
          rememberMe: true
        };

        const expiresIn = user.rememberMe ? '30d' : envConfig.jwtExpiresIn;

        const res = await request(app).post(logInEndpoint).send(user);

        expect(expiresIn).toBe('30d');
      });

      it('Should set expiresIn to envConfig.jwtExpiresIn when rememberMe is false', async () => {
        const user = {
          email: 'john@test.com',
          password: 'password',
          rememberMe: false
        };

        const expiresIn = user.rememberMe ? '30d' : envConfig.jwtExpiresIn;

        const res = await request(app).post(logInEndpoint).send(user);

        expect(expiresIn).toBe(envConfig.jwtExpiresIn);
      });
    });
  });

  describe(`[POST] ${forgotPasswordEndpoint}`, () => {
    let sendMailMock;

    beforeEach(() => {
      // Create a mock function for sendMail
      sendMailMock = jest.fn();

      // Spy on createTransport and mock its implementation
      jest.spyOn(nodemailer, 'createTransport').mockReturnValue({
        sendMail: sendMailMock,
      });
    });

    afterEach(() => {
      // Restore the original implementations
      jest.restoreAllMocks();
    });

    it('Should raise an error when attempting to send an email does not exist', async () => {
      const user = {
        email: 'john1@test.com'
      };

      const res = await request(app).post(forgotPasswordEndpoint).send(user);

      expect(res.statusCode).toBe(400);
    });

    it('Should send the reset password link via email successfully', async () => {
      const user = {
        email: 'john@test.com'
      };

      const res = await request(app).post(forgotPasswordEndpoint).send(user);

      expect(nodemailer.createTransport).toHaveBeenCalled();

      expect(sendMailMock).toHaveBeenCalled();
  
      expect(res.statusCode).toBe(200);
    });
  });
});
