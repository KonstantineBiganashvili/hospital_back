const Sequelize = require('sequelize');

const sequelize = new Sequelize('usersdb', 'kote', 'kote', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;
