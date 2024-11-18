const TaskColumn = require('../models').TaskColumn;

exports.createTaskColumn = async (req, res, next) => {
    try {
        const { projectId, taskColumnName, taskColumnPosition } = req.body;
        const newTaskColumn = await TaskColumn.create({ projectId, taskColumnName, taskColumnPosition });
        res.status(201).json({ message: 'Task column created successfully', taskColumnId: newTaskColumn.id });
    } catch (err) {
        next(err);
    }
};

exports.getTaskColumn = async (req, res, next) => {
    try {
        const columns = await TaskColumn.findAll();
        res.status(200).json({ message: 'Task columns found', columns });
    } catch (err) {
        next(err);
    }
};

exports.getTaskColumnById = async (req, res, next) => {
    try {
        const column = await TaskColumn.findByPk(req.params.id);
        if (!column) {
            return res.status(404).json({ message: 'Task column not found' });
        }
        res.status(200).json({ message: 'Task column found', column });
    } catch (err) {
        next(err);
    }
};

exports.updateTaskColumn = async (req, res, next) => {
    try {
        const { taskColumnName, taskColumnPosition } = req.body;
        const column = await TaskColumn.findByPk(req.params.id);
        if (!column) {
            return res.status(404).json({ message: 'Task column not found' });
        }
        await column.update({ taskColumnName, taskColumnPosition });
        res.status(200).json({ message: 'Task column updated successfully', column });
    } catch (err) {
        next(err);
    }
};

exports.deleteTaskColumn = async (req, res, next) => {
    try {
        const column = await TaskColumn.findByPk(req.params.id);
        if (!column) {
            return res.status(404).json({ message: 'Task column not found' });
        }
        await column.destroy();
        res.status(200).json({ message: 'Task column deleted successfully' });
    } catch (err) {
        next(err);
    }
};