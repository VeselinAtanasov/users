import dotenv from 'dotenv';

import User from '../models/User.js';
import asyncMiddleware from '../middleware/asyncMiddleware.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import constants from '../constants/constants.js';
import { checkPassword, createHashedPassword } from '../utils/bcrypt.js';
import removeSensitiveInformation from '../utils/removeSensitiveInformation.js';
import TokenManager from '../utils/TokenManager.js';

// load process config
dotenv.config();

export const register = asyncMiddleware(async (req, res, next) => {
    const { username, email, password, role, avatar } = req.body;

    // TODO:... cehck if avatar is passed - if yes uploaded it!

    // Create the user
    const user = await User.create({ username, email, password, role, avatar });

    // Create jwt token by invoking the virtual property on the user instance:
    const token = user.getJWT;

    // store the token in the database

    return res
        .status(constants.STATUS_CODE.CREATED)
        .json({ success: true, message: constants.MESSAGE.SUCCESS_REGISTRATION, data: removeSensitiveInformation(user), token });
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

    const token = user.getJWT;

    return res
        .status(constants.STATUS_CODE.SUCCESS)
        .json({ success: true, message: constants.MESSAGE.SUCCESS_LOGIN, data: removeSensitiveInformation(user), token });
});

export const logout = asyncMiddleware(async (req, res, next) => {
    // will implement black list for all tokens after logout per userS
    const tokenManager = new TokenManager(req.user, req.token, req.decoded);

    // Add token in a black list
    await tokenManager.addTokenInUserBlackList();

    // implement cookie parser and clear the cookie here // TODO...

    return res
        .status(constants.STATUS_CODE.REMOVED)
        .json({ success: true, message: constants.MESSAGE.SUCCESS_LOGOUT, data: [] });
});

export const getProfile = asyncMiddleware(async (req, res, next) => {
    // the user was already caught in the protect middleware, but we need to fetch also the friends
    const user = req.user;

    // fetch friends as well and return them:
    const friends = await user.getFriends();

    const response = removeSensitiveInformation(user);
    response.friends = friends.map((friend) => removeSensitiveInformation(friend));

    return res
        .status(constants.STATUS_CODE.SUCCESS)
        .json({ success: true, message: constants.MESSAGE.PROFILE_RETRIEVED, data: response });
});

export const updateProfile = asyncMiddleware(async (req, res, next) => {
    const user = req.user;

    // not allowed to change your role if you are not an admin
    if (req.user.role === 'user' && req.body.role) {
        return next(new ErrorResponse(constants.MESSAGE.ROLE_CHANGE_NOT_ALLOWED, constants.STATUS_CODE.BAD_REQUEST));
    }

    // Each user can change his own password, but only admin can change other users password
    if (req.body.password) {
        req.body.password = await createHashedPassword(req.body.password);
    }

    // TODO if the request contains avatar to be uploaded - handle this!

    const updatedUser = await user.update(req.body);

    return res
        .status(constants.STATUS_CODE.SUCCESS)
        .json({ success: true, message: constants.MESSAGE.PROFILE_UPDATED, data: removeSensitiveInformation(updatedUser) });
});

export const getOwnFriends = asyncMiddleware(async (req, res, next) => {
    const user = req.user;

    // get all user friends:
    const friends = await user.getFriends();

    // send in the response only the usernames
    const filteredFriends = friends.map((friend) => friend.username);

    return res
        .status(constants.STATUS_CODE.SUCCESS)
        .json({ success: true, message: constants.MESSAGE.USER_FRIENDS, data: { friends: filteredFriends } });
});

export const addOwnFriend = asyncMiddleware(async (req, res, next) => {
    const user = req.user;
    const { friendUserName } = req.body;

    // if the input is wrong!
    if (!friendUserName) {
        return next(new ErrorResponse(constants.MESSAGE.WRONG_INPUT, constants.STATUS_CODE.BAD_REQUEST));
    }

    if (user.username === friendUserName) {
        return next(new ErrorResponse(constants.MESSAGE.WRONG_FRIEND, constants.STATUS_CODE.BAD_REQUEST));
    }

    // get total number of friends in the list:
    const numberOfFriends = await user.countFriends();

    // check if maximum number of friends is reached
    if (numberOfFriends > process.env.MAXIMUM_NUMBER_OF_FRIENDS_IN_LIST) {
        return next(new ErrorResponse(constants.MESSAGE.FRIENDS_LIMIT_REACHED, constants.STATUS_CODE.BAD_REQUEST));
    }

    // get friend profile from database
    const friendProfile = await User.findOne({ where: { username: friendUserName } });

    // add friend
    await user.addFriend(friendProfile);

    return res
        .status(constants.STATUS_CODE.SUCCESS)
        .json({ success: true, message: constants.MESSAGE.FRIEND_ADDED, data: { friend: removeSensitiveInformation(friendProfile) } });
});

export const removeOwnFriend = asyncMiddleware(async (req, res, next) => {
    const user = req.user;
    const { friendUserName } = req.body;

    // if the input is wrong!
    if (!friendUserName) {
        return next(new ErrorResponse(constants.MESSAGE.WRONG_INPUT, constants.STATUS_CODE.BAD_REQUEST));
    }

    // get the friend from database
    const friendProfile = await User.findOne({ where: { username: friendUserName } });

    // remove the friend
    await user.removeFriend(friendProfile);

    return res
        .status(constants.STATUS_CODE.SUCCESS)
        .json({ success: true, message: constants.MESSAGE.FRIEND_REMOVED, data: { removedFriend: friendUserName } });
});

export const addAvatar = asyncMiddleware(async (req, res, next) => {

});
