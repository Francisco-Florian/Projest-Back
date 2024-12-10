const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email format',
                field: 'email',
            });
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.',
                field: 'password',
            });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                message: 'Email Or password is incorrect',
                field: 'email',
            });
        }

        const user = await User.create({ email, password });
        res.status(201).json({ message: 'User created successfully', userId: user.id });
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
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
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



exports.forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User with this email does not exist." });
        }

        // Générer un token de réinitialisation avec jsonwebtoken
        const resetToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Créer l'URL de réinitialisation
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;


        // Envoi de l'email de réinitialisation avec SendGrid
        const msg = {
            to: user.email,
            from: 'projest.contact@gmail.com',
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset</h1>
                <p>You have requested a password reset. Please click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
            `,
        };

        await sgMail.send(msg);
        res.status(200).json({ message: "Password reset email has been sent." });

    } catch (err) {
        console.error('Error sending password reset email:', err);
        next(err);
    }
};


exports.resetPassword = async (req, res, next) => {
    const { token, email, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "Invalid or expired token" });
        }
        if (user.email !== email) {
            return res.status(400).json({ message: "Wrong email" });
        }
        

        user.password = newPassword;

        user.changed('updatedAt', true);
        await user.save();

        res.status(200).json({ message: "Password has been reset successfully" });
    } catch (err) {
        console.error("Error resetting password:", err);
        if (err.name === "TokenExpiredError") {
            return res.status(400).json({ message: "The reset link has expired. Please request a new one." });
        }
        next(err);
    }
};


