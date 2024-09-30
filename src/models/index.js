const User = require('./user');
const Project = require('./project');


//define relationships
User.hasMany(Project);
Project.belongsTo(User);


module.exports = {
    User,
    Project,
};
