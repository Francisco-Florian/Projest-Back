const { Project, Task, TaskColumn } = require('../models');

exports.createProject = async (req, res, next) => {
    try {
        const { projectName, deadline, projectStatus } = req.body;
        const createdBy = req.user.id;
       
        /**
         * Finds an existing project based on the project name and creator.
         *
         * @param {Object} criteria - The criteria to find the project.
         * @param {string} criteria.projectName - The name of the project.
         * @param {string} criteria.createdBy - The creator of the project.
         * @returns {Promise<Object|null>} The existing project if found, otherwise null.
         */
        const existingProject = await Project.findOne({ 
            where: { 
                projectName,
                createdBy
            }
        });
        if (existingProject) {
            return res.status(400).json({ message: 'You already have a project with this name' });
        }
       
        const project = await Project.create({ projectName, createdBy, deadline, projectStatus });
        res.status(201).json({ message: 'Project created successfully', projectId: project.id });
    } catch (err) {
        next(err);
    }
};


exports.getProject = async (req, res, next) => {
    try {
        /**
         * Retrieves all projects created by the current user.
         *
         * @param {Object} req - The request object.
         * @param {Object} req.user - The user object attached to the request.
         * @param {number} req.user.id - The ID of the current user.
         * @returns {Promise<Array>} A promise that resolves to an array of projects.
         */
        const projects = await Project.findAll({
            where: { createdBy: req.user.id }
        });
        res.status(200).json({ message: 'Projects found', projects });
    } catch (err) {
        next(err);
    }
};

exports.updateProject = async (req, res, next) => {
    try {
        const { projectName, deadline, projectStatus } = req.body;
        /**
         * Retrieves a project based on the provided project ID and the user who created it.
         *
         * @param {Object} req - The request object.
         * @param {Object} req.params - The parameters from the request.
         * @param {string} req.params.id - The ID of the project to retrieve.
         * @param {Object} req.user - The user object from the request.
         * @param {string} req.user.id - The ID of the user who created the project.
         * @returns {Promise<Object|null>} The project object if found, otherwise null.
         */
        const project = await Project.findOne({
            where: {
                id: req.params.id,
                createdBy: req.user.id
            }
        });
        if (!project) {
            return res.status(404).json({ message: 'Project not found or you do not have permission to modify it' });
        }
        await project.update({ projectName, deadline, projectStatus });
        res.status(200).json({ message: 'Project updated successfully', project });
    } catch (err) {
        next(err);
    }
};

exports.getProjectById = async (req, res, next) => {
    try {
        const project = await Project.findOne({
            where: {
                id: req.params.idProject,
                createdBy: req.user.id
            }
        });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ project });
    } catch (err) {
        next(err);
    }
};

exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findOne({
            where: {
                id: req.params.idProject,
                createdBy: req.user.id,
            },
        });

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const columns = await TaskColumn.findAll({ where: { projectId: project.id } });

        for (const column of columns) {
            await Task.destroy({ where: { columnId: column.id } });
        }

        await TaskColumn.destroy({ where: { projectId: project.id } });

        await project.destroy();

        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        console.error("Error in deleteProject controller:", err);
        next(err);
    }
};

