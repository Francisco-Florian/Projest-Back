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

        // Récupérer toutes les tâches liées à la colonne et au projet spécifiés, en les triant par taskOrder
        const tasks = await Task.findAll({
            where: {
                projectId: idProject,
                columnId: idColumn,
            },
            order: [['taskOrder', 'ASC']], // Trier par `taskOrder`
        });

        res.status(200).json({ message: 'Tasks retrieved successfully', tasks });
    } catch (err) {
        next(err);
    }
};




exports.updateTask = async (req, res, next) => {
    try {
        const { taskName, description, taskDeadline, columnId } = req.body;
        const { idTask } = req.params;

        // Trouver la tâche par son ID
        const task = await Task.findByPk(idTask);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Si la colonne a changé, réorganiser les tâches
        if (columnId && task.columnId !== columnId) {
            const originalColumnId = task.columnId;

            // Réorganiser les tâches restantes dans la colonne d'origine
            const tasksInOriginalColumn = await Task.findAll({
                where: {
                    columnId: originalColumnId,
                },
                order: [['taskOrder', 'ASC']],
            });

            // Réattribuer l'ordre des tâches restantes dans la colonne d'origine
            let currentOrder = 1;
            for (let currentTask of tasksInOriginalColumn) {
                if (currentTask.id !== task.id) {
                    await currentTask.update({ taskOrder: currentOrder });
                    currentOrder++;
                }
            }

            // Déplacer la tâche vers la nouvelle colonne
            task.columnId = columnId;

            // Définir le nouvel ordre de la tâche dans la nouvelle colonne
            const tasksInNewColumn = await Task.findAll({
                where: {
                    columnId: columnId,
                },
                order: [['taskOrder', 'DESC']],
            });

            // Définir le `taskOrder` comme étant le plus grand `taskOrder` + 1, ou 1 s'il n'y a pas de tâche
            task.taskOrder = tasksInNewColumn.length > 0 ? tasksInNewColumn[0].taskOrder + 1 : 1;
        }

        // Créer un objet qui contient uniquement les champs fournis à mettre à jour
        const updatedFields = {
            ...(taskName !== undefined && { taskName }),
            ...(description !== undefined && { description }),
            ...(taskDeadline !== undefined && { taskDeadline }),
        };

        // Mise à jour de la tâche avec les champs spécifiés (y compris `columnId` et `taskOrder` s'ils ont changé)
        await task.update({ ...updatedFields, columnId: task.columnId, taskOrder: task.taskOrder });

        // Retourner la tâche mise à jour
        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (err) {
        console.error('Error updating task:', err);
        next(err);
    }
};





exports.deleteTask = async (req, res, next) => {
    try {
        const { idTask } = req.params;

        if (!idTask) {
            return res.status(400).json({ message: 'Task ID is required' });
        }

        const task = await Task.findByPk(idTask);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.destroy();

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error("Error in deleteTask controller:", err);
        next(err);
    }
};



