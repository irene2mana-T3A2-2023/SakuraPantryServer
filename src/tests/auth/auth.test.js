import request from 'supertest';
import app from '../../server.js';
import { envConfig } from '../../configs/env.js';
import nodemailer from 'nodemailer';
import { jest } from '@jest/globals';

const registerEndpoint = '/api/auth/register';
const logInEndpoint = '/api/auth/login';
const forgotPasswordEndpoint = '/api/auth/forgot-password';
const resetPasswordEndpoint = '/api/auth/reset-password';

describe('Authentication-related APIs', () => {
  describe(`[POST] ${registerEndpoint}`, () => {
    it('Should raise an error when one of required fields is missing', async () => {
      const requestBody = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      };

      const res = await request(app).post(registerEndpoint).send(requestBody);

      expect(res.statusCode).toBe(400);
    });

    it('Should raise an error when password and confirmPassword do not matched', async () => {
      const requestBody = {
        firstName: 'John',
        lastName: 'Lenon',
        email: 'john@test.com',
        password: 'password',
        confirmPassword: 'password1'
      };

      const res = await request(app).post(registerEndpoint).send(requestBody);

      expect(res.statusCode).toBe(400);
    });

    it('Should raise an error when registering with an invalid password', async () => {
      const requestBody = {
        firstName: 'John',
        lastName: 'Lenon',
        email: 'john@test.com',
        password: 'p@ ssword',
        confirmPassword: 'p@ ssword'
      };

      const res = await request(app).post(registerEndpoint).send(requestBody);

      expect(res.statusCode).toBe(400);
    });

    it('Should register successfully', async () => {
      const requestBody = {
        firstName: 'John',
        lastName: 'Lenon',
        email: 'john@test.com',
        password: 'password',
        confirmPassword: 'password'
      };

      const res = await request(app).post(registerEndpoint).send(requestBody);

      expect(res.statusCode).toBe(200);
    });

    it('Should raise an error when attempting to register with a duplicated email', async () => {
      const requestBody = {
        firstName: 'Johntest',
        lastName: 'Lenontest',
        email: 'john@test.com',
        password: 'password',
        confirmPassword: 'password'
      };

      const res = await request(app).post(registerEndpoint).send(requestBody);

      expect(res.statusCode).toBe(400);
    });
  });

  describe(`[POST] ${logInEndpoint}`, () => {
    it('Should raise an error when one of the required fields is missing', async () => {
      const requestBody = {
        email: '',
        password: ''
      };

      const res = await request(app).post(logInEndpoint).send(requestBody);

      expect(res.statusCode).toBe(400);
    });

    describe('Should raise an error when login with invalid email or password', () => {
      it('Should raise an error when attempting to log in with an email that does not exist in the database', async () => {
        const requestBody = {
          email: 'johnTest@test.com',
          password: 'password'
        };

        const res = await request(app).post(logInEndpoint).send(requestBody);

        expect(res.statusCode).toBe(400);
      });

      it('Should raise an error when attempting to log in with a wrong password', async () => {
        const requestBody = {
          email: 'john@test.com',
          password: 'passWord'
        };

        const res = await request(app).post(logInEndpoint).send(requestBody);

        expect(res.statusCode).toBe(400);
      });
    });

    describe('Test expiration of token', () => {
      it('Should set expiresIn to 30d when rememberMe is true', async () => {
        const requestBody = {
          email: 'john@test.com',
          password: 'password',
          rememberMe: true
        };

        const expiresIn = requestBody.rememberMe ? '30d' : envConfig.jwtExpiresIn;

        const res = await request(app).post(logInEndpoint).send(requestBody);

        expect(expiresIn).toBe('30d');

        expect(res.statusCode).toBe(200);
      });

      it('Should set expiresIn to envConfig.jwtExpiresIn when rememberMe is false', async () => {
        const requestBody = {
          email: 'john@test.com',
          password: 'password',
          rememberMe: false
        };

        const expiresIn = requestBody.rememberMe ? '30d' : envConfig.jwtExpiresIn;

        const res = await request(app).post(logInEndpoint).send(requestBody);

        expect(expiresIn).toBe(envConfig.jwtExpiresIn);

        expect(res.statusCode).toBe(200);
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
      const requestBody = {
        email: 'john1@test.com'
      };

      const res = await request(app).post(forgotPasswordEndpoint).send(requestBody);

      expect(res.statusCode).toBe(400);
    });

    it('Should send the reset password link via email successfully', async () => {
      const requestBody = {
        email: 'john@test.com'
      };

      const res = await request(app).post(forgotPasswordEndpoint).send(requestBody);

      expect(nodemailer.createTransport).toHaveBeenCalled();

      expect(sendMailMock).toHaveBeenCalled();
  
      expect(res.statusCode).toBe(200);
    });
  });

  describe(`[POST] ${resetPasswordEndpoint}`, () => {
    it('Should raise an error when newPassword and confirmNewPassword do not matched', async () => {
      const param = {

      }
    })
  })
});
