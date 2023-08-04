import User from '../models/User.js';
import asyncMiddleware from '../middleware/asyncMiddleware.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import constants from '../constants/constants.js';
import { checkPassword } from '../utils/bcrypt.js';

export const register = asyncMiddleware(async (req, res, next) => {
    const { username, email, password, role, avatar, friends } = req.body;

    // Create the user
    const user = await User.create({ username, email, password, role, avatar, friends });

    // do not return the hashed the password to the user. There should be a way to do this in the User model// TODO...
    // one possible option is to send filteredUser
    // const { id, username, email, role, avatar, createdAt, updatedAt } = filteredUser;

    // Create jwt token by invoking the virtual property on the user instance:
    const token = user.getJWT;
    return res
        .status(constants.STATUS_CODE.CREATED)
        .json({ success: true, message: constants.MESSAGE.SUCCESS_REGISTRATION, data: user, token });
});

export const login = asyncMiddleware(async (req, res, next) => {
    const { username, password } = req.body;

    // Check for valid input and return error if true
    if (!username || !password) {
        return next(new ErrorResponse(constants.MESSAGE.INVALID_CREDENTIALS, constants.STATUS_CODE.BAD_REQUEST));
    }

    const user = await User.findOne({ where: { username } });

    // Check is user exists and return error for invalid credentials
    if (!user) {
        return next(new ErrorResponse(constants.MESSAGE.INVALID_CREDENTIALS, constants.STATUS_CODE.BAD_REQUEST));
    }

    // Check password:
    const isMatched = await checkPassword(user.password, password);

    // Check if password matched and if no return error for invalid credentials
    if (!isMatched) {
        return next(new ErrorResponse(constants.MESSAGE.INVALID_CREDENTIALS, constants.STATUS_CODE.BAD_REQUEST));
    }

    return res
        .status(constants.STATUS_CODE.SUCCESS)
        .json({ success: true, message: constants.MESSAGE.SUCCESS_LOGIN, data: [], token: user.getJWT });
});

export const logout = asyncMiddleware(async (req, res, next) => {
    return res.status(constants.STATUS_CODE.REMOVED).json({ success: true, message: constants.MESSAGE.SUCCESS_LOGOUT, data: [] });
});

export const getProfile = asyncMiddleware(async (req, res, next) => {
    // the user was already caught in the protect middleware, but we need to fetch also the friends and send them in the response
    const { id, username, email, role, avatar, createdAt, updatedAt } = req.user;

    // fetch friends as well and return them:

    return res
        .status(constants.STATUS_CODE.SUCCESS)
        .json({ success: true, message: constants.MESSAGE.PROFILE_RETRIEVED, data: { id, username, email, role, avatar, createdAt, updatedAt } });
});

// TODO... If user is Admin it is not allow to add friends!!!
export const updateProfile = asyncMiddleware(async (req, res, next) => {
});

export const deleteProfile = asyncMiddleware(async (req, res, next) => {
});

// TODO... If user is Admin it is not allow to add friends!!!
export const getFriends = asyncMiddleware(async (req, res, next) => {
});

// TODO... If user is Admin it is not allow to add friends!!!
export const addFriend = asyncMiddleware(async (req, res, next) => {
});

// TODO... If user is Admin it is not allow to add friends!!!
export const removeFriend = asyncMiddleware(async (req, res, next) => {
});
