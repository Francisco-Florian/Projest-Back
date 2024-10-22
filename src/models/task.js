const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('task', {
    columnId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: 'taskColumns',
            key: 'id',
        },
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: 'projects',
            key: 'id',
        },
    },
    taskName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    taskDeadline: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    taskOrder: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
});


module.exports = Task;