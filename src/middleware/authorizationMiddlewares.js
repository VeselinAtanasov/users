import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/ErrorResponse.js';
import constants from '../constants/constants.js';
import User from '../models/User.js';

// Protect routes:
export const adminPermission = async (req, res, next) => {
    // no need to check if exists, because this middleware will be called after protected middleware
    const user = req.user;

    if (user.role !== 'admin') {
        return next(new ErrorResponse(constants.MESSAGE.ONLY_FOR_ADMIN, constants.STATUS_CODE.NOT_AUTHORIZED));
    }

    return next();
};

export const userPermission = async (req, res, next) => {
    // no need to check if user exists, because this middleware will be called after protected middleware
    const user = req.user;

    if (user.role !== 'user') {
        return next(new ErrorResponse(constants.MESSAGE.ONLY_FOR_USERS, constants.STATUS_CODE.NOT_AUTHORIZED));
    }

    return next();
};

// Protect routes:
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // get the token from the request!
        token = req.headers.authorization.split(' ')[1]; // set token from Bearer token in header
    }

    // Check if token exists
    if (!token) {
        return next(new ErrorResponse(constants.MESSAGE.NOT_AUTHORIZED, constants.STATUS_CODE.NOT_AUTHORIZED));
    }

    try {
        // Verify token:
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.id;

        req.user = await User.findOne({ where: { id } });

        if (!req.user) {
            return next(new ErrorResponse(constants.MESSAGE.INVALID_TOKEN, constants.STATUS_CODE.NOT_AUTHORIZED));
        }

        next();
    } catch (error) {
        return next(new ErrorResponse(constants.MESSAGE.NO_ACCESS_TO_ROUTE, constants.STATUS_CODE.NOT_AUTHORIZED));
    }
};
