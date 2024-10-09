const { Task } = require('../models');

exports.createTask = async (req, res, next) => {
    try {
        const { columnId, taskName, description, taskDeadline, taskOrder } = req.body;
        /**
         * Creates a new task with the specified details.
         *
         * @param {string} columnId - The ID of the column to which the task belongs.
         * @param {string} taskName - The name of the task.
         * @param {string} description - A brief description of the task.
         * @param {Date} taskDeadline - The deadline for the task.
         * @param {number} taskOrder - The order of the task within the column.
         * @returns {Promise<Object>} The created task object.
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
         * @param {Object} req.params - The parameters from the request.
         * @param {string} req.params.id - The ID of the task to retrieve.
         * @returns {Promise<Object|null>} The task object if found, otherwise null.
         */
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task found', task });
    } catch (err) {
        next(err);
    }
};

exports.updateTask = async (req, res, next) => {
    try {
        /**
         * Extracts task details from the request body.
         * 
         * @param {Object} req - The request object.
         * @param {Object} req.body - The body of the request.
         * @param {string} req.body.taskName - The name of the task.
         * @param {string} req.body.description - The description of the task.
         * @param {string} req.body.taskDeadline - The deadline of the task.
         * @param {number} req.body.taskOrder - The order of the task.
         */
        const { taskName, description, taskDeadline, taskOrder } = req.body;
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        task.update({ taskName, description, taskDeadline, taskOrder });
        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (err) {
        next(err);
    }
};

exports.deleteTask = async (req, res, next) => {
    try {
        /**
         * Retrieves a task by its primary key (ID) from the database.
         *
         * @param {Object} req - The request object.
         * @param {Object} req.params - The parameters from the request.
         * @param {string} req.params.id - The ID of the task to retrieve.
         * @returns {Promise<Object|null>} A promise that resolves to the task object if found, or null if not found.
         */
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.destroy();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        next(err);
    }
};