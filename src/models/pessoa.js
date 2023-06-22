import Sequelize from 'sequelize';
import database from '../db.js'
import Usuario from './usuario.js';
 
const Pessoa = database.define('pessoa', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    nascimento: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    telefone: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    endereco: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    cep: {
        type: Sequelize.BIGINT,
        allowNull: false,
    }
});

Pessoa.associate = function(models) {
    Pessoa.hasMany(models.Usuario, { foreignKey: 'pessoaId' });
};

export default Pessoa;