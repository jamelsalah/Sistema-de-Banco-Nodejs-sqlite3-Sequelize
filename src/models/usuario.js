import Sequelize from 'sequelize';
import database from '../db.js';

const Usuario = database.define('usuario', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    pessoaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pessoas',
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

Usuario.associate = function(models) {
    Usuario.belongsTo(models.Pessoa, { foreignKey: 'pessoaId' });
};

export default Usuario;