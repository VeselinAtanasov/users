import User from '../models/User.js';
import constants from '../constants/constants.js';
import ErrorResponse from '../utils/ErrorResponse.js';

class UserService {
    async createUser(username, email, password, role) {
        return await User.create({ username, email, password, role });
    }

    async findUserByUserName(username) {
        return await User.findOne({ where: { username } });
    }

    async getAllFriends(user) {
        return await user.getFriends();
    }

    async updateUser(user, body) {
        return await user.update(body);
    }

    async addFriend(user, friendProfile) {
        return await user.addFriend(friendProfile);
    }

    async removeFriend(user, friendProfile) {
        return await user.removeFriend(friendProfile);
    }

    async countFriends(user) {
        return await user.countFriends();
    }

    async findUserByPk(id) {
        return await User.findByPk(id);
    }

    async deleteUser(user) {
        return await user.destroy();
    }

    async getUserAndFriends(id) {
        return await User.findOne({ where: { id }, include: { model: User, as: 'friends' } });
    }

    async findAllUsersAndCount(pageSize, page) {
        return await User.findAndCountAll({
            limit: pageSize,
            offset: page * pageSize
        });
    }

    async saveUser(user) {
        return await user.save();
    }

    async createUserAndFriends(userData) {
        // start transaction:
        const transaction = await User.transaction();

        try {
            // create the user:
            const user = await User.create({
                username: userData.username,
                email: userData.email,
                password: userData.password,
                role: userData.role
            }, { transaction });

            // get friends profiles:
            const friendProfile = await User.findAll({
                where: {
                    username: userData.friends
                }
            }, { transaction });

            // if friends profiles are missing, throw an error
            if (!friendProfile || userData.friends.length !== friendProfile.length) {
                // throw custom error:
                throw new ErrorResponse(constants.MESSAGE.FRIEND_NOT_EXISTS, constants.STATUS_CODE.BAD_REQUEST);
            }

            // add the friends in the list:
            await user.addFriends(friendProfile, { transaction });

            // If the execution reaches this line, no errors were thrown.
            // We commit the transaction.
            await transaction.commit();
            return user;
        } catch (error) {
            // If the execution reaches this line, an error was thrown.
            // We rollback the transaction.
            await transaction.rollback();
            throw error;
        }
    }
}

export default UserService;
