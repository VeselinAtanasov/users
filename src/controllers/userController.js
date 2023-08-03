import User from '../models/User.js';
import { checkPassword } from '../utils/bcrypt.js';

export const register = async (req, res, next) => {
    try {
        const { username, email, password, role, avatar, friends } = req.body;

        // Create the user
        const user = await User.create({ username, email, password, role, avatar, friends });

        // do not return the hashed the password to the user. There should be a way to do this in the User model// TODO...

        // Create jwt token by invoking the virtual property on the user instance:
        const token = user.getJWT;
        return res.status(200).json({ success: true, message: 'Successful Registration', data: user, token });
    } catch (error) {
        return res.status(200).json({ success: false, message: 'Error', data: error });
    }
};

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        // Check for valid input and return error if true
        if (!username || !password) {

        }

        const user = await User.findOne({ where: { username } });
        // Check is user exists and return error for invalid credentials
        // if (!user) {
        //  }
        console.log(JSON.stringify(user));

        // Check password:
        const isMatched = await checkPassword(user.password, password);

        // Check if password matched and if no return error for invalid credentials
        if (!isMatched) {

        }

        return res.status(200).json({ success: true, message: 'Success', data: [], token: user.getJWT });
    } catch (error) {
        return res.status(200).json({ success: false, message: 'Error', data: [] });
    }
};

export const logout = async (req, res, next) => {
    return res.status(200).json({ success: true, message: 'Successful Logout', data: [] });
};
