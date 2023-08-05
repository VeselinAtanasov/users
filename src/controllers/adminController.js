import User from '../models/User.js';
import asyncMiddleware from '../middleware/asyncMiddleware.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import constants from '../constants/constants.js';
import { createHashedPassword } from '../utils/bcrypt.js';
import removeSensitiveInformation from '../utils/removeSensitiveInformation.js';

export const createUser = asyncMiddleware(async (req, res, next) => {
    const { username, email, password, role, avatar } = req.body;

    // Create the user
    const user = await User.create({ username, email, password, role, avatar });

    // do not send the newly created user token!
    return res
        .status(constants.STATUS_CODE.CREATED)
        .json({ success: true, message: constants.MESSAGE.USER_CREATED_BY_ADMIN, data: removeSensitiveInformation(user) });
});

export const deleteUser = asyncMiddleware(async (req, res, next) => {
    const id = req.params.id;

    const user = await User.findByPk(id);

    if (!user) {
        return next(new ErrorResponse(constants.MESSAGE.MISSING_USER, constants.STATUS_CODE.NOT_FOUND));
    }

    // remove the user form database
    await user.destroy();

    return res
        .status(constants.STATUS_CODE.SUCCESS)
        .json({ success: true, message: constants.MESSAGE.USER_DELETED, data: {} });
});

export const getOneUserById = asyncMiddleware(async (req, res, next) => {
    const id = req.params.id;

    //  const user = await User.findByPk(id);

    // get user along with all it's friends
    const user = await User.findOne({ where: { id }, include: { model: User, as: 'friends' } });

    // If user is missing return error
    if (!user) {
        return next(new ErrorResponse(constants.MESSAGE.MISSING_USER, constants.STATUS_CODE.NOT_FOUND));
    }

    // remove user and it's friends sensitive information
    const response = removeSensitiveInformation(user);
    response.friends = user.friends.map((friend) => removeSensitiveInformation(friend));

    return res
        .status(constants.STATUS_CODE.SUCCESS)
        .json({ success: true, message: constants.MESSAGE.USER_RETRIEVED, data: { user: response } });
});

export const getAllUsers = asyncMiddleware(async (req, res, next) => {
    const page = Number(req.query.page) || 0;
    const pageSize = Number(req.query.pageSize) || 50;

    // get all users
    const users = await User.findAndCountAll({
        limit: pageSize,
        offset: page * pageSize
    });

    users.rows = users.rows.map((friend) => removeSensitiveInformation(friend));

    return res
        .status(constants.STATUS_CODE.SUCCESS)
        .json({ success: true, message: constants.MESSAGE.USERS_RETRIEVED, data: { users } });
});

export const resetPassword = asyncMiddleware(async (req, res, next) => {
    const { password, username } = req.body;

    // check if admin tries to update more params then password
    const doesTryingToUpdateMoreSettings = Object.keys(req.body).filter((setting) => setting === 'password' & setting === 'username').length === 0;

    // get user by username:
    const user = await User.findOne({ where: { username } });

    // if user is missing in db return error
    if (!user) {
        return next(new ErrorResponse(constants.MESSAGE.MISSING_USER, constants.STATUS_CODE.NOT_FOUND));
    }

    // hash the new password
    user.password = await createHashedPassword(password);

    // save the new password
    await user.save();

    // Define message response based on the admin request
    let message = constants.MESSAGE.USER_PASS_UPDATED;
    if (doesTryingToUpdateMoreSettings) {
        message = constants.MESSAGE.TRIED_TO_UPDATE_MORE;
    }

    return res
        .status(constants.STATUS_CODE.SUCCESS)
        .json({ success: true, message, data: [] });
});
