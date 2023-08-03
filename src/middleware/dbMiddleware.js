import { testDbConnection } from '../configs/db.js';

export default async (req, resp, next) => {
    try {
        await testDbConnection();
        return next();
    } catch (error) {
        return next(error);
    }
};
