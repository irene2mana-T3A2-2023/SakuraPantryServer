import request from 'supertest';
import nodemailer from 'nodemailer';
import { jest } from '@jest/globals';
import app from '../../server.js';
import { envConfig } from '../../configs/env.js';
import User from '../../models/UserModel.js';

const registerEndpoint = '/api/auth/register';
const logInEndpoint = '/api/auth/login';
const forgotPasswordEndpoint = '/api/auth/forgot-password';
const resetPasswordEndpoint = '/api/auth/reset-password';
const currentUserEndpoint = '/api/auth/current-user';

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

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ message: 'Missing required fields' });
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

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ message: 'Password and confirm password do not match' });
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

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({
        message: 'Password should be between 8 to 30 characters and contain letters or numbers only'
      });
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

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: 'User successfully registered' });
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

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ message: 'Email already exists' });
    });
  });

  describe(`[POST] ${logInEndpoint}`, () => {
    it('Should raise an error when one of the required fields is missing', async () => {
      const requestBody = {
        email: '',
        password: ''
      };

      const res = await request(app).post(logInEndpoint).send(requestBody);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ message: 'Missing email or password' });
    });

    describe('Should raise an error when login with invalid email or password', () => {
      it('Should raise an error when attempting to log in with an email that does not exist in the database', async () => {
        const requestBody = {
          email: 'johnTest@test.com',
          password: 'password'
        };

        const res = await request(app).post(logInEndpoint).send(requestBody);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ message: 'Invalid email or password' });
      });

      it('Should raise an error when attempting to log in with a wrong password', async () => {
        const requestBody = {
          email: 'john@test.com',
          password: 'passWord'
        };

        const res = await request(app).post(logInEndpoint).send(requestBody);

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ message: 'Invalid email or password' });
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

        expect(expiresIn).toEqual('30d');
        expect(res.statusCode).toEqual(200);
      });

      it('Should set expiresIn to envConfig.jwtExpiresIn when rememberMe is false', async () => {
        const requestBody = {
          email: 'john@test.com',
          password: 'password',
          rememberMe: false
        };

        const expiresIn = requestBody.rememberMe ? '30d' : envConfig.jwtExpiresIn;

        const res = await request(app).post(logInEndpoint).send(requestBody);

        expect(expiresIn).toEqual(envConfig.jwtExpiresIn);
        expect(res.statusCode).toEqual(200);
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
        sendMail: sendMailMock
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

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ message: 'User not found' });
    });

    it('Should send the reset password link via email successfully', async () => {
      const requestBody = {
        email: 'john@test.com'
      };

      const res = await request(app).post(forgotPasswordEndpoint).send(requestBody);

      expect(nodemailer.createTransport).toHaveBeenCalled();
      expect(sendMailMock).toHaveBeenCalled();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: 'Password reset link has been sent to your email' });
    });
  });

  describe(`[POST] ${resetPasswordEndpoint}`, () => {
    it('Should raise an error when one of required fields is missing', async () => {
      const requestBody = {
        resetToken: '',
        newPassword: '',
        confirmNewPassword: ''
      };

      const res = await request(app).post(resetPasswordEndpoint).send(requestBody);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ message: 'Missing required fields' });
    });

    it('Should raise an error when newPassword and confirmNewPassword do not matched', async () => {
      const requestBody = {
        resetToken: '12345',
        newPassword: 'password',
        confirmNewPassword: 'password1'
      };

      const res = await request(app).post(resetPasswordEndpoint).send(requestBody);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ message: 'New password and confirm new password do not match' });
    });

    it('Should raise an error when providing invalid reset token', async () => {
      const requestBody = {
        resetToken: '12345',
        newPassword: 'password',
        confirmNewPassword: 'password'
      };

      const res = await request(app).post(resetPasswordEndpoint).send(requestBody);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toEqual({ message: 'Invalid or expired reset password token' });
    });

    it('Should reset password with a valid token', async () => {
      const existingUser = await User.findOne({ email: 'john@test.com' });

      existingUser.resetPasswordToken = '123456789';
      existingUser.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

      await existingUser.save();

      const requestBody = {
        resetToken: '123456789',
        newPassword: 'password',
        confirmNewPassword: 'password'
      };

      const res = await request(app).post(resetPasswordEndpoint).send(requestBody);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: 'Password has been successfully reset' });
    });
  });

  describe(`[GET] ${currentUserEndpoint}`, () => {
    it('Should raise an error if user has not logged in', async () => {
      const res = await request(app).get(currentUserEndpoint);

      expect(res.statusCode).toEqual(401);
      expect(res.body).toEqual({ message: 'Unauthorized access. Please authenticate to proceed' });
    });

    it('Should raise an error when the provided token is invalid or expired', async () => {
      const res = await request(app)
        .get(currentUserEndpoint)
        .set('Authorization', `Bearer 7fk8579jfhk398fj3985`);

      expect(res.statusCode).toEqual(401);
      expect(res.body).toEqual({ message: 'Unauthorized access. Please authenticate to proceed' });
    });

    it('Should get the current user information for normal user', async () => {
      const res = await request(app)
        .get(currentUserEndpoint)
        .set('Authorization', `Bearer ${global.mockUsers.userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.firstName).toEqual('Chihiro');
      expect(res.body.lastName).toEqual('Ogino');
      expect(res.body.email).toEqual('user@test.com');
      expect(res.body.role).toEqual('user');
    });

    it('Should get the current user information for admin', async () => {
      const res = await request(app)
        .get(currentUserEndpoint)
        .set('Authorization', `Bearer ${global.mockUsers.adminToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.firstName).toEqual('Lara');
      expect(res.body.lastName).toEqual('Macintosh');
      expect(res.body.email).toEqual('admin@test.com');
      expect(res.body.role).toEqual('admin');
    });
  });
});
