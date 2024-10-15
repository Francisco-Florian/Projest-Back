const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        /**
         * Finds an existing user in the database by email.
         *
         * @param {Object} User - The User model.
         * @param {Object} email - The email address to search for.
         * @returns {Promise<Object|null>} - A promise that resolves to the user object if found, or null if not found.
         */
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const user = await User.create({ email, password });
        res.status(201).json({message : 'User created successfully', userId: user.id});
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Email or password is incorrect' });
        }
        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return res.status(401).json({ message: 'Email or password is incorrect' });
        }
        /**
         * Generates a JSON Web Token (JWT) for the authenticated user.
         *
         * @param {Object} user - The authenticated user object.
         * @param {string} user.id - The unique identifier of the user.
         * @returns {string} - The generated JWT token.
         */
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login Successful', token });
    } catch (err) {
        next(err);
    }
};

exports.verifyUser = (req, res) => {
    res.status(200).json({ 
        message: "User authenticated", 
        user: { 
            id: req.user.id, 
            email: req.user.email 
        } 
    });
};