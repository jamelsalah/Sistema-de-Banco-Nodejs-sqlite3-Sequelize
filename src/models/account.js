import Sequelize from 'sequelize';
import database from '../db.js'
 
const Account = database.define('account', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
    },
    number: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true
    },
    openingDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    balance: {
        type: Sequelize.DOUBLE,
        allowNull: false
    }
});

Account.associate = function(models) {
    Account.belongsTo(models.User, { foreignKey: 'userId' });
};

export default Account;