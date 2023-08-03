import bcrypt from 'bcryptjs';

export const checkPassword = async (dbPassword, enteredPassword) => {
    const result = await bcrypt.compare(enteredPassword, dbPassword);
    return result;
};

export const createHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};
