import bcrypt from 'bcryptjs';

export default class AuthenticationService {
    async checkPassword(dbPassword, enteredPassword) {
        const result = await bcrypt.compare(enteredPassword, dbPassword);
        return result;
    };

    async createHashedPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    };
}
