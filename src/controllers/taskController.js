const { Task } = require('../models');

exports.createTask = async (req, res, next) => {
    try {
        const { columnId, taskName, description, taskDeadline, taskOrder } = req.body;
        const task = await Task.create({ columnId, taskName, description, taskDeadline, taskOrder });
        res.status(201).json({ message: 'Task created successfully', taskId: task.id });
    } catch (err) {
        next(err);
    }
};

exports.getTask = async (req, res, next) => {
    try {
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