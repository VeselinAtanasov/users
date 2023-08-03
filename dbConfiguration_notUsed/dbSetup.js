import pkg from 'pg';
import dbConfig from './dbConfig.js';

const { Client } = pkg;

const client = new Client({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    port: 5432
});

const createDatabase = async () => {
    try {
        await client.connect(); // gets connection
        await client.query(`CREATE DATABASE ${dbConfig.DB}`); // sends queries
        return true;
    } catch (error) {
        console.error(error.stack);
        return false;
    } finally {
        await client.end(); // closes connection
    }
};

export default createDatabase;

// createDatabase().then((result) => {
//     if (result) {
//         console.log('Database created');
//     }
// });

/*

var pgtools = require('pgtools');
pgtools.createdb({
  user: 'postgres',
  password: 'some pass',
  port: 5432,
  host: 'localhost'
}, 'test-db', function (err, res) {
  if (err) {
    console.error(err);
    process.exit(-1);
  }
  console.log(res);
});

*/
