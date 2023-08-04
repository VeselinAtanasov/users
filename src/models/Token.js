// example.js
import { sequelize } from '../configs/db.js';
import { DataTypes } from 'sequelize';

const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'tokens_whitelist'
});

export default Token;
