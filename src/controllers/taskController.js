const { Task } = require('../models');
const TaskColumn = require('../models/taskColumn');

exports.createTask = async (req, res, next) => {
    try {
        const { columnId, taskName, projectId } = req.body;

        // Vérification des données requises
        if (!columnId || !taskName || !projectId) {
            return res.status(400).json({ message: 'columnId, taskName, and projectId are required' });
        }

        // Vérifier si la colonne existe
        const column = await TaskColumn.findByPk(columnId);
        if (!column) {
            return res.status(404).json({ message: 'Column not found' });
        }

        // Vérifier si une tâche avec le même nom existe déjà dans la colonne et le projet
        const duplicateTask = await Task.findOne({
            where: { columnId, projectId, taskName }
        });
        if (duplicateTask) {
            return res.status(400).json({ message: 'Task with the same name already exists in this column' });
        }


        // Compter le nombre de tâches dans cette colonne
        const taskCount = await Task.count({ where: { columnId } });
        const taskOrder = taskCount + 1;

        // Créer la tâche
        const task = await Task.create({
            projectId,
            columnId,
            taskName,
            taskOrder,
        });

        // Mettre à jour le champ `updatedAt` de la colonne si nécessaire
        column.changed('updatedAt', true);
        await column.save();

        // Retourner la tâche créée
        res.status(201).json({
            message: 'Task created successfully',
            task,
        });
    } catch (err) {
        next(err); // Gestion des erreurs
    }
};




exports.getTasks = async (req, res, next) => {
    try {
        const { idProject, idColumn } = req.params;

        // Récupérer toutes les tâches liées à la colonne et au projet spécifiés
        const tasks = await Task.findAll({
            where: {
                projectId: idProject,
                columnId: idColumn,
            },
        });

        // Retirer la vérification qui retourne 404 si aucune tâche n'est trouvée
        res.status(200).json({ message: 'Tasks retrieved successfully', tasks });
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
