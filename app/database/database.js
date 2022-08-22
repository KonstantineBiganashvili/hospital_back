const Sequelize = require('sequelize');

const sequelize = new Sequelize('hospitaldb', 'kote', 'kote', {
    host: 'localhost',
    dialect: 'postgres',
});

try {
    sequelize.authenticate();
    console.log('Connection has been established!');
} catch (error) {
    console.error('Unable to connect to the database', error);
}

module.exports = sequelize;
