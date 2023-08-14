// import dbConfig from '../../dbConfiguration/dbConfig.js';
import dotenv from 'dotenv';

import { Sequelize } from 'sequelize';
dotenv.config();

export const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DIALECT,
    pool: {
        max: Number(process.env.POOL_MAX),
        min: Number(process.env.POOL_MIN),
        acquire: process.env.POOL_ACUIRE,
        idle: process.env.POOL_IDLE
    }
});

export const testDbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        return sequelize;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
};
