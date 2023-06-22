import Sequelize from 'sequelize';
import database from '../db.js';

const User = database.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    personId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'people',
          key: 'id'
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.CHAR(32),
        allowNull: false,
    }
});

User.associate = function(models) {
    User.hasMany(models.Account, { foreignKey: 'userId' });
};

User.associate = function(models) {
    User.belongsTo(models.Person, { foreignKey: 'personId' });
};

export default User;