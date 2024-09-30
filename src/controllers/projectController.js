const { Project } = require('../models');

exports.createProject = async (req, res, next) => {
    try {
        const { projectName, createdBy, deadline, projectStatus } = req.body;
        const project = await Project.create({ projectName, createdBy, deadline, projectStatus });
        res.status(201).json({ message: 'Project created successfully', projectId: project.id });
    } catch (err) {
        next(err);
    }
};

exports.getProject = async (req, res, next) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Project found', project });
    } catch (err) {
        next(err);
    }
};

exports.updateProject = async (req, res, next) => {
    try {
        const { projectName, deadline, projectStatus } = req.body;
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        project.update({ projectName, deadline, projectStatus });
        res.status(200).json({ message: 'Project updated successfully', project });
    } catch (err) {
        next(err);
    }
};

exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        await project.destroy();
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        next(err);
    }
};