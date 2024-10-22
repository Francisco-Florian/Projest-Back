const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const taskColumn = sequelize.define('taskColumn', {
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: 'projects',
            key: 'id',
        },
    },
    taskColumnName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    taskColumnPosition: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
});

module.exports = taskColumn;