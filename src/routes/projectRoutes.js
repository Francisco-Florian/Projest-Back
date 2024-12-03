const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const taskColumnController = require('../controllers/taskColumnController');
const taskController = require('../controllers/taskController');

router.post('/create', authMiddleware, projectController.createProject);
router.get('/', authMiddleware, projectController.getProject);
router.get('/:idProject', authMiddleware, projectController.getProjectById);
router.patch('/:idProject', authMiddleware, projectController.updateProject);
router.delete('/:idProject', authMiddleware, projectController.deleteProject);

// Columns

router.post('/:idProject/columns', authMiddleware, taskColumnController.createTaskColumn);
router.get('/:idProject/columns', authMiddleware, taskColumnController.getTaskColumn);
// router.patch('/:idProject/columns/:idColumn', taskColumnController.updateTaskColumn);
router.delete('/:idProject/columns/:idColumn', authMiddleware, taskColumnController.deleteTaskColumn);

// Tasks
router.post('/:idProject/columns/:idColumn/tasks', authMiddleware, taskController.createTask);
router.get('/:idProject/columns/:idColumn/tasks', authMiddleware, taskController.getTasks);
router.patch('/:idProject/columns/:idColumn/tasks/:idTask', authMiddleware, taskController.updateTask);
router.delete('/:idProject/columns/:idColumn/tasks/:idTask', authMiddleware, taskController.deleteTask);



module.exports = router;