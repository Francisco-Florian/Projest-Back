const express = require('express');
const cors = require('cors');
const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const taskColumnRoute = require('./routes/taskColumnRoute');
const errorHandler = require('./middleware/errorHandler');
const sequelize = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/project', authMiddleware, projectRoutes);
app.use('/api/project/:projectId/column', authMiddleware, taskColumnRoute);
app.use('/api/project/:projectId/task', authMiddleware, taskRoutes);


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
