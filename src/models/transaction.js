import Sequelize from 'sequelize';
import database from '../db.js'
 
const Transaction = database.define('transaction', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    accountId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'accounts',
          key: 'id'
        }
    },
    type: {
        type: Sequelize.CHAR(1),
        allowNull: false
    },
    transactionDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    value: {
        type: Sequelize.DOUBLE,
        allowNull: false,
    },
    originAccount: {
        type: Sequelize.BIGINT,
    },
    targetAccount: {
        type: Sequelize.BIGINT,
    },
    observation: {
        type: Sequelize.STRING,
    },
});

Transaction.associate = function(models) {
    Transaction.belongsTo(models.Account, { foreignKey: 'accountId' });
};

export default Transaction;