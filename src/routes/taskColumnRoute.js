const express = require('express');
const router = express.Router();
const taskColumnController = require('../controllers/taskColumnController');

router.post('/:idProject/column', taskColumnController.createTaskColumn);
router.get('/:idProject/column', taskColumnController.getTaskColumn);
// router.post('/:idProject/column/:idColumn/task', authMiddleware, projectController.createTask);

module.exports = router;