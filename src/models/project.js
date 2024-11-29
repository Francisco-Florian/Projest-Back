const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('project', {
    projectName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    projectStatus: {
        type: DataTypes.ENUM([
            'active',
            'completed',
            'cancelled',
        ]),
        allowNull: true,
    },
    hasVisitedProject: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
});

module.exports = Project;