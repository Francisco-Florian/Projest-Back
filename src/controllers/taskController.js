const { Task } = require('../models');

exports.createTask = async (req, res, next) => {
    try {
        const { columnId, taskName, description, taskDeadline, taskOrder } = req.body;
        /**
         * Creates a new task with the specified details.
         *
         * @param {Object} taskDetails - The details of the task to be created.
         * @param {string} taskDetails.columnId - The ID of the column to which the task belongs.
         * @param {string} taskDetails.taskName - The name of the task.
         * @param {string} taskDetails.description - A brief description of the task.
         * @param {Date} taskDetails.taskDeadline - The deadline for the task.
         * @param {number} taskDetails.taskOrder - The order of the task within the column.
         * @returns {Promise<Object>} The created task.
         */
        const task = await Task.create({ columnId, taskName, description, taskDeadline, taskOrder });
        res.status(201).json({ message: 'Task created successfully', taskId: task.id });
    } catch (err) {
        next(err);
    }
};

exports.getTask = async (req, res, next) => {
    try {
        /**
         * Retrieves a task by its primary key (ID).
         *
         * @param {Object} req - The request object.
         * @param {Object} req.params - The parameters of the request.
         * @param {string} req.params.id - The ID of the task to retrieve.
         * @returns {Promise<Object|null>} The task object if found, otherwise null.
         */
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.destroy();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        next(err);
    }
};