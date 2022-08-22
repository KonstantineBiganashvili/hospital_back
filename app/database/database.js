const Sequelize = require('sequelize');

const sequelize = new Sequelize('hospitaldb', 'kote', 'kote', {
    host: 'localhost',
    dialect: 'postgres',
});

module.exports = sequelize;
