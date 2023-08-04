import { testDbConnection, sequelize } from '../configs/db.js';
import User from '../models/User.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import constants from '../constants/constants.js';

export const syncDb = async (req, resp, next) => {
    try {
        await testDbConnection();
        return next();
    } catch (error) {
        return next(new ErrorResponse(constants.MESSAGE.DB_DOWN, constants.STATUS_CODE.SERVICE_UNAVAILABLE));
    }
};

// Not sure if this should be invoked on each request!
export const syncModels = async (req, res, next) => {
    try {
        // create association many-to-many, with friends alias;
        User.belongsToMany(User, { as: 'friends', through: 'user_friend' });
        // await User.sync();
        await sequelize.sync();
        console.log('User Model synchronization successful!');
        return next();
    } catch (error) {
        return next(new ErrorResponse(constants.MESSAGE.MODEL_NOT_SYNCED, constants.STATUS_CODE.SERVICE_UNAVAILABLE));
    }
};
