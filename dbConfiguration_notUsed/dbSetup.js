import pkg from 'pg';
import dbConfig from './dbConfig.js';
import dotenv from 'dotenv';
const { Client } = pkg;

dotenv.config();

const client = new Client({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    port: 5432
});

const createDatabase = async () => {
    try {
        await client.connect(); // gets connection
        await client.query(`CREATE DATABASE ${process.env.DB}}`); // sends queries
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    } finally {
        await client.end(); // closes connection
    }
};

const result = await createDatabase();

console.log(result);
