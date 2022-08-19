const DataTypes = require('sequelize');
const sequelize = require('../database/database');

const User = sequelize.define('users', {
  login: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
});

module.exports = User;
