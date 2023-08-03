// import User from '../models/User.js';
import { sequelize } from '../configs/db.js';

// Not sure if this should be invoked on each request!
export default async (req, res, next) => {
    try {
        // await User.sync();
        await sequelize.sync();
        console.log('User Model synchronization successful!');
        return next();
    } catch (error) {
        console.log('Error During User model synchronization', error);
        return next(error);
    }
};
