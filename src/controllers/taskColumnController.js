const { taskColumn } = require('../models')

exports.createTaskColumn = async (req, res, next) => {
    try {
        const { projectId, taskColumnName, taskColumnPosition } = req.body;
        const taskColumn = await taskColumn.create({ projectId, taskColumnName, taskColumnPosition });
        res.status(201).json({ message: 'Task column created successfully', taskColumnId: taskColumn.id });
    } catch (err) {
        next(err);
    }
};

exports.getTaskColumn = async (req, res, next) => {
    try {
        const taskColumn = await taskColumn.findByPk(req.params.id);
        if (!taskColumn) {
            return res.status(404).json({ message: 'Task column not found' });
        }
        res.status(200).json({ message: 'Task column found', taskColumn });
    } catch (err) {
        next(err);
    }
};

exports.updateTaskColumn = async (req, res, next) => {
    try {
        const { taskColumnName, taskColumnPosition } = req.body;
        const taskColumn = await taskColumn.findByPk(req.params.id);
        if (!taskColumn) {
            return res.status(404).json({ message: 'Task column not found' });
        }
        taskColumn.update({ taskColumnName, taskColumnPosition });
        res.status(200).json({ message: 'Task column updated successfully', taskColumn });
    } catch (err) {
        next(err);
    }
};

exports.deleteTaskColumn = async (req, res, next) => {
    try {
        const taskColumn = await taskColumn.findByPk(req.params.id);
        if (!taskColumn) {
            return res.status(404).json({ message: 'Task column not found' });
        }
        await taskColumn.destroy();
        res.status(200).json({ message: 'Task column deleted successfully' });
    } catch (err) {
        next(err);
    }
};