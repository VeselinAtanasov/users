import UserService from '../services/UserService.js';
import FileStorageService from '../services/FileStorageService.js';
import asyncMiddleware from '../middleware/asyncMiddleware.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import constants from '../constants/constants.js';
import { createHashedPassword } from '../utils/bcrypt.js';
import removeSensitiveInformation from '../utils/removeSensitiveInformation.js';

export const createUser = asyncMiddleware(async (req, res, next) => {
    const { username, email, password, role } = req.body;
    const userService = new UserService();

    // Create the user
    const user = await userService.createUser(username, email, password, role);

    // do not send the newly created user token!
    return res
        .status(constants.STATUS_CODE.CREATED)
        .json({ success: true, message: constants.MESSAGE.USER_CREATED_BY_ADMIN, data: removeSensitiveInformation(user) });
});

export const deleteUser = asyncMiddleware(async (req, res, next) => {
    const id = req.params.id;
    const userService = new UserService();

    const user = await userService.findUserByPk(id);
    const storageService = new FileStorageService(user);

    if (!user) {
        return next(new ErrorResponse(constants.MESSAGE.MISSING_USER, constants.STATUS_CODE.NOT_FOUND));
    }

    // before deleting the user remove it's avatar from storage if there is such!

    if (user.avatar) {
        try {
            await storageService.deleteFile(process.env.PATH_FOR_AVATARS);
        } catch (error) {
            console.log('File was not deleted!', error);
            // Despite that file was not successfully deleted destroy the user in DB and return success response,
            // as this will not affect the application and has no impact on user experience.
            // here we may store the failed operation in log file and later to take care of deletion of all old avatars!
        }

        // remove the user form database
        await userService.deleteUser(user);

        return res
            .status(constants.STATUS_CODE.SUCCESS)
            .json({ success: true, message: constants.MESSAGE.USER_DELETED, data: {} });
    }
});

export const getOneUserById = asyncMiddleware(async (req, res, next) => {
    const id = req.params.id;
    const userService = new UserService();

    //  const user = await User.findByPk(id);

    // get user along with all it's friends
    const user = await userService.getUserAndFriends(id);

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
    const userService = new UserService();

    // get all users
    const users = await userService.findAllUsersAndCount(pageSize, page);

    users.rows = users.rows.map((friend) => removeSensitiveInformation(friend));

    return res
        .status(constants.STATUS_CODE.SUCCESS)
        .json({ success: true, message: constants.MESSAGE.USERS_RETRIEVED, data: { users } });
});

export const resetPassword = asyncMiddleware(async (req, res, next) => {
    const { password, username } = req.body;
    const userService = new UserService();

    // check if admin tries to update more params then password
    const doesTryingToUpdateMoreSettings = Object.keys(req.body).filter((setting) => setting !== 'password' & setting !== 'username').length !== 0;

    // get user by username:
    const user = await userService.findUserByUserName(username);

    // if user is missing in db return error
    if (!user) {
        return next(new ErrorResponse(constants.MESSAGE.MISSING_USER, constants.STATUS_CODE.NOT_FOUND));
    }

    // hash the new password
    user.password = await createHashedPassword(password);

    // save the new password
    await userService.saveUser(user);

    // Define message response based on the admin request
    let message = constants.MESSAGE.USER_PASS_UPDATED;
    if (doesTryingToUpdateMoreSettings) {
        message = constants.MESSAGE.TRIED_TO_UPDATE_MORE;
    }

    return res
        .status(constants.STATUS_CODE.SUCCESS)
        .json({ success: true, message, data: [] });
});
