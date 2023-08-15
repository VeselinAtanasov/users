import User from '../models/User';

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

    async getUserByPk(id) {
        return await User.findByPk(id);
    }

    async deleteUser(user) {
        return await user.destroy();
    }

    async getUserAndFriends(id) {
        return await User.findOne({ where: { id }, include: { model: User, as: 'friends' } });
    }
}

export default UserService;