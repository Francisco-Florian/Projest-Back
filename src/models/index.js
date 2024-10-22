const User = require('./user');
const Project = require('./project');
const Task = require('./task');
const TaskColumn = require('./taskColumn');


// define relationships
User.hasMany(Project);
Project.belongsTo(User);
Project.hasMany(Task);
Task.belongsTo(Project);


module.exports = {
    User,
    Project,
    Task,
    TaskColumn,
};
