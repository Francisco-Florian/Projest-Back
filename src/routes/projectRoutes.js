const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, projectController.createProject);
router.get('/', authMiddleware, projectController.getProject);
router.get('/:idProject', authMiddleware, projectController.getProjectById);
router.patch('/:idProject', authMiddleware, projectController.updateProject);
router.delete('/:idProject', authMiddleware, projectController.deleteProject);



module.exports = router;