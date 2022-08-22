const DataTypes = require('sequelize');
const sequelize = require('../database/database');

const Doctor = sequelize.define(
    'doctors',
    {
        doctor_name: {
            type: DataTypes.STRING,
        },
        specialization: {
            type: DataTypes.STRING,
        },
    },
    { timestamps: false }
);

module.exports = Doctor;
