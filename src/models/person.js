import Sequelize from 'sequelize';
import database from '../db.js'
 
const Person = database.define('person', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    birth: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    telephone: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    postalCode: {
        type: Sequelize.BIGINT,
        allowNull: false,
    }
});

Person.associate = function(models) {
    Person.hasMany(models.User, { foreignKey: 'personId' });
};

export default Person;