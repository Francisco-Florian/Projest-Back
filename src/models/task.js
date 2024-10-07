const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('task', {
    // columnId: {
    //     type: DataTypes.INTEGER,
    //     allowNull: false,
    //     foreignKey: true,
    // },
    taskName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    taskDeadline: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    taskOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});


module.exports = Task;