const express = require('express');
const router = express.Router();
const taskColumnController = require('../controllers/taskColumnController');

router.post('/', taskColumnController.createTaskColumn);
router.get('/', taskColumnController.getTaskColumn);
router.get('/:id', taskColumnController.getTaskColumnById);
router.patch('/:id', taskColumnController.updateTaskColumn);
router.delete('/:id', taskColumnController.deleteTaskColumn);

module.exports = router;