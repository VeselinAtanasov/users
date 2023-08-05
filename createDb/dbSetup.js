import pkg from 'pg';
import dotenv from 'dotenv';
const { Client } = pkg;

dotenv.config();

const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 5432
});

const createDatabase = async () => {
    try {
        await client.connect(); // gets connection
        await client.query(`CREATE DATABASE ${process.env.DB}`); // sends queries
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
