const User = require('./user');
const Project = require('./project');
const Task = require('./task');
const TaskColumn = require('./taskColumn');

// Définir les relations
User.hasMany(Project);
Project.belongsTo(User);

// Relations entre Project et Task/TaskColumn
Project.hasMany(Task);
Task.belongsTo(Project);

Project.hasMany(TaskColumn, { foreignKey: 'projectId' });
TaskColumn.belongsTo(Project, { foreignKey: 'projectId' });

// Relations entre TaskColumn et Task
TaskColumn.hasMany(Task, { foreignKey: 'columnId' });
Task.belongsTo(TaskColumn, { foreignKey: 'columnId' });

module.exports = {
    User,
    Project,
    Task,
    TaskColumn,
};
