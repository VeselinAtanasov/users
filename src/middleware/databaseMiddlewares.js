import { testDbConnection, sequelize } from '../configs/db.js';
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
        // sync the database
        await sequelize.sync();
        console.log('Models synchronized successfully!');
        return next();
    } catch (error) {
        console.log('Error during Models synchronization');
        return next(new ErrorResponse(constants.MESSAGE.MODEL_NOT_SYNCED, constants.STATUS_CODE.SERVICE_UNAVAILABLE));
    }
};
