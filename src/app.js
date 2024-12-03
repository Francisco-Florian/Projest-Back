const express = require('express');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const taskColumnRoute = require('./routes/taskColumnRoute');
const errorHandler = require('./middleware/errorHandler');
const sequelize = require('./config/database');
const helmet = require("helmet")
const rateLimit = require('express-rate-limit');


const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet())

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 70,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after a minute'
});

app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', authMiddleware, projectRoutes);



// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});


sequelize.sync({ alter: true })
    .then(() => console.log('Tables synchronisées avec succès'))
    .catch(err => console.error('Erreur de synchronisation des tables :', err));
