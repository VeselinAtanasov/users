// example.js
import { sequelize } from '../db/database.js';
import { DataTypes } from 'sequelize';
import User from './User.js';

const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: true,
            notEmpty: true
        }
    }
}, {
    tableName: 'tokens'
});

User.hasMany(Token, {
    foreignKey: 'user_id'
});
Token.belongsTo(User);

export default Token;
