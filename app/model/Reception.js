const DataTypes = require('sequelize');
const sequelize = require('../database/database');
const Doctor = require('./Doctor');
const User = require('./User');

const Reception = sequelize.define('receptions', {
    patient_name: {
        type: DataTypes.STRING,
    },
    appointment_time: {
        type: DataTypes.DATE,
    },
    complaints: {
        type: DataTypes.STRING,
    },
});

Reception.belongsTo(Doctor);
Reception.belongsTo(User);

module.exports = Reception;
