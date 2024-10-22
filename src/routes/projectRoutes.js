const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, projectController.createProject);
router.get('/', authMiddleware, projectController.getProject);
router.get('/:id', authMiddleware, projectController.getProjectById);
router.patch('/:id', authMiddleware, projectController.updateProject);
router.delete('/:id', authMiddleware, projectController.deleteProject);

module.exports = router;