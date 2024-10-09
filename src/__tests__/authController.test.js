const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authController = require('../controllers/authController'); // Ajustez le chemin en fonction de votre projet

jest.mock('../models');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.post('/register', authController.register);
app.post('/login', authController.login);

describe('Auth Controller', () => {

  // Test pour la fonction register
  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      User.findOne.mockResolvedValue(null); // Simule que l'utilisateur n'existe pas
      User.create.mockResolvedValue(mockUser); // Simule la création de l'utilisateur

      const res = await request(app)
        .post('/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User created successfully');
      expect(res.body).toHaveProperty('userId', mockUser.id);
    });

    it('should return 400 if email already exists', async () => {
      User.findOne.mockResolvedValue({ id: 1, email: 'test@example.com' }); // Simule un utilisateur existant

      const res = await request(app)
        .post('/register')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message', 'Email already exists');
    });
  });

  // Test pour la fonction login
  describe('POST /login', () => {
    it('should login successfully and return a token', async () => {
      const mockUser = { id: 1, email: 'test@example.com', comparePassword: jest.fn().mockResolvedValue(true) };
      const mockToken = 'mocked.jwt.token';
      User.findOne.mockResolvedValue(mockUser); // Simule que l'utilisateur existe
      jwt.sign.mockReturnValue(mockToken); // Simule la génération du token

      const res = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Login Successful');
      expect(res.body).toHaveProperty('token', mockToken);
    });

    it('should return 404 if email is incorrect', async () => {
      User.findOne.mockResolvedValue(null); // Simule un utilisateur non trouvé

      const res = await request(app)
        .post('/login')
        .send({ email: 'wrong@example.com', password: 'password123' });

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('message', 'Email or password is incorrect');
    });

    it('should return 401 if password is incorrect', async () => {
      const mockUser = { id: 1, email: 'test@example.com', comparePassword: jest.fn().mockResolvedValue(false) };
      User.findOne.mockResolvedValue(mockUser); // Simule que l'utilisateur existe

      const res = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message', 'Email or password is incorrect');
    });
  });
});
