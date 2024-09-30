const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('project', {
    projectName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id',
        },
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    projesctStatus: {
        type: DataTypes.ENUM?.([
            'active',
            'completed',
            'cancelled',
        ]),
        allowNull: false,
    },
});

module.exports = Project;