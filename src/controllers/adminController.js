import User from '../models/User.js';
import asyncMiddleware from '../middleware/asyncMiddleware.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import constants from '../constants/constants.js';
import { checkPassword } from '../utils/bcrypt.js';

export const createUser = asyncMiddleware(async (req, res, next) => {
});

export const deleteUser = asyncMiddleware(async (req, res, next) => {
});

export const getAllUsers = asyncMiddleware(async (req, res, next) => {
});

// Do not allow admin to modify any other then password!
export const resetPassword = asyncMiddleware(async (req, res, next) => {
});
