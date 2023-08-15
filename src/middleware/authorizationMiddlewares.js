import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ErrorResponse from '../utils/ErrorResponse.js';
import TokenService from '../services/TokenService.js';
import constants from '../constants/constants.js';
import User from '../models/User.js';

dotenv.config();
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

    // if process env. is not cookie - try to get the token from authorization header and token blacklist solution will be used
    if (process.env.USE_TOKEN_FROM !== 'cookie') {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // get the token from the request if it is there
            token = req.headers.authorization.split(' ')[1]; // set token from Bearer token in header
        } else if (req.cookies.token) { // set token from cookie
            // Get the token from the cookie - if it is missing force the user to login
            token = req.cookies.token;
        }
    } else {
        // if process env === cookie, token will be retrieved from cookie and will be invalidated on logout directly
        if (req.cookies.token) { // set token from cookie
            // Get the token from the cookie - if it is missing force the user to login
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // get the token from the request if it is there
            token = req.headers.authorization.split(' ')[1]; // set token from Bearer token in header
        }
    }

    // Check if token exists
    if (!token) {
        return next(new ErrorResponse(constants.MESSAGE.NO_TOKEN, constants.STATUS_CODE.NOT_AUTHORIZED));
    }

    try {
        // Verify token:
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const id = decoded.id;
        const username = decoded.username;

        console.log('jwt decoded: ', decoded);

        // if token is retrieved from authorization header
        if (process.env.USE_TOKEN_FROM !== 'cookie') {
            // check if token is in black list if it is reject if not continue:
            const tokenService = new TokenService({ username }, token, decoded);
            const isInBlackList = await tokenService.checkIfTokenIsInBlackList();

            if (isInBlackList) {
                return next(new ErrorResponse(constants.MESSAGE.TOKEN_IN_BLACK_LIST, constants.STATUS_CODE.NOT_AUTHORIZED));
            }
        }

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
