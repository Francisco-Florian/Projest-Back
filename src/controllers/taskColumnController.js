const TaskColumn = require('../models').TaskColumn;
const project = require('../models').Project;

exports.createTaskColumn = async (req, res, next) => {
    try {
        const { taskColumnName } = req.body;
        const { idProject } = req.params;

        // Vérifier que le projet existe
        const existingColumns = await TaskColumn.findAll({
            where: { projectId: idProject },
        });

        // Vérifier les doublons de nom
        const duplicateColumn = existingColumns.find(
            (column) => column.taskColumnName === taskColumnName
        );

        if (duplicateColumn) {
            return res.status(400).json({
                message: 'A column with the same name already exists in this project'
            });
        }

        const taskColumnPosition = existingColumns.length + 1;

        // Créer la nouvelle colonne
        const newTaskColumn = await TaskColumn.create({
            projectId: idProject,
            taskColumnName,
            taskColumnPosition
        });

        res.status(201).json({
            message: 'Task column created successfully',
            taskColumnId: newTaskColumn.id
        });
    } catch (err) {
        next(err);
    }
};



// crée les colonnes par défaut

exports.createDefaultColumns = async (projectId) => {
    try {
        // Récupérer le projet
        const Project = await project.findByPk(projectId);
        if (!Project) {
            throw new Error('Project not found');
        }

        // Vérifier si le projet a été visité
        if (!Project.hasVisitedProject) {
            const existingColumns = await TaskColumn.findAll({ where: { projectId } });
            if (existingColumns.length === 0) {
                const defaultColumns = [
                    { taskColumnName: 'To Do', taskColumnPosition: 1, projectId },
                    { taskColumnName: 'Doing', taskColumnPosition: 2, projectId },
                    { taskColumnName: 'Done', taskColumnPosition: 3, projectId },
                ];

                await TaskColumn.bulkCreate(defaultColumns);

                await Project.update({ hasVisitedProject: true });
            }
        }
    } catch (error) {
        console.error('Error in createDefaultColumns:', error.message);
        throw error;
    }
};


// recuperer les colonnes

exports.getTaskColumn = async (req, res, next) => {
    try {
        const projectId = req.params.idProject;
        await this.createDefaultColumns(projectId);
        const columns = await TaskColumn.findAll({
            where: { projectId },
            order: [['taskColumnPosition', 'ASC']],
        });
        res.status(200).json({ message: 'Task columns found', columns });
    } catch (err) {
        next(err);
    }
};

// recuperer une colonne

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

// modifier une colonne

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

// supprimer une colonne

exports.deleteTaskColumn = async (req, res, next) => {
    try {
        const column = await TaskColumn.findOne({
            where: {
                id: req.params.idColumn,
                projectId: req.params.idProject,
            },
        });
        if (!column) {
            return res.status(404).json({ message: 'Task column not found' });
        }
        await column.destroy();
        res.status(200).json({ message: 'Task column deleted successfully' });
    } catch (err) {
        next(err);
    }
};