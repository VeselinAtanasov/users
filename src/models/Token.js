// example.js
import { sequelize } from '../db/database.js';
import { DataTypes } from 'sequelize';

const Token = sequelize.define('Token', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    tokens: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
}, {
    tableName: 'tokens_blacklist'
});

export default Token;
