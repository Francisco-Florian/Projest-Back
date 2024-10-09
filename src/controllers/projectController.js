const { Project } = require('../models');

exports.createProject = async (req, res, next) => {
    try {
        const { projectName, createdBy, deadline, projectStatus } = req.body;
        
        const existingProject = await Project.findOne({ where: { projectName } });
        if (existingProject) {
            return res.status(400).json({ message: 'Name is already used' });
        }
        /**
         * Creates a new project with the specified details.
         *
         * @param {Object} project - The project details.
         * @param {string} project.projectName - The name of the project.
         * @param {string} project.createdBy - The creator of the project.
         * @param {Date} project.deadline - The deadline of the project.
         * @param {string} project.projectStatus - The status of the project.
         * @returns {Promise<Object>} The created project.
         */
        const project = await Project.create({ projectName, createdBy, deadline, projectStatus });
        res.status(201).json({ message: 'Project created successfully', projectId: project.id });
    } catch (err) {
        next(err);
    }
};


exports.getProject = async (req, res, next) => {
    try {
        /**
         * Retrieves all projects from the database.
         *
         * @returns {Promise<Array>} A promise that resolves to an array of project objects.
         */
        const project = await Project.findAll();
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
        /**
         * Extracts project details from the request body.
         * 
         * @param {Object} req - The request object.
         * @param {Object} req.body - The body of the request.
         * @param {string} req.body.projectName - The name of the project.
         * @param {string} req.body.deadline - The deadline of the project.
         * @param {string} req.body.projectStatus - The status of the project.
         */
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
        /**
         * Retrieves a project by its primary key (ID).
         *
         * @param {Object} req - The request object.
         * @param {Object} req.params - The parameters from the request.
         * @param {string} req.params.id - The ID of the project to retrieve.
         * @returns {Promise<Object|null>} The project object if found, otherwise null.
         */
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