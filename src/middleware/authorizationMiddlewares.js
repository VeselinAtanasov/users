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

    // Get the token from the cookie - if it is missing force the user to login
    if (req.cookies.token) { // set token from cookie
        token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
        return next(new ErrorResponse(constants.MESSAGE.NO_TOKEN, constants.STATUS_CODE.NOT_AUTHORIZED));
    }

    try {
        // Verify token:
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.id;

        console.log('jwt decoded: ', decoded);

        // Token verification passed - get the user!
        req.user = await User.findOne({ where: { id } });
        req.token = token;
        req.decoded = decoded;

        if (!req.user) {
            return next(new ErrorResponse(constants.MESSAGE.INVALID_TOKEN, constants.STATUS_CODE.NOT_AUTHORIZED));
        }

        next();
    } catch (error) {
        const message = constants.MESSAGE.INVALID_TOKEN + ' - ' + error.message;
        return next(new ErrorResponse(message, constants.STATUS_CODE.NOT_AUTHORIZED));
    }
};
