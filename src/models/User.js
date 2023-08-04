// example.js
import { sequelize } from '../configs/db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { DataTypes } from 'sequelize';
import { createHashedPassword } from '../utils/bcrypt.js';

dotenv.config();

// import Actor from './Friends.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            notNull: false,
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true
        }
    },
    role: {
        type: DataTypes.ENUM,
        values: ['admin', 'user'],
        allowNull: false,
        validate: {
            notNull: true,
            notEmpty: true,
            is: /^(admin|user)$/i
        }
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // this one should be a list of friends. Using array type!
    friends: {
        // type: DataTypes.STRING,
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    },
    // add virtual property for creating a JWT for specific user
    getJWT: {
        type: DataTypes.VIRTUAL,
        get () {
            return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRE
            });
        },
        set (value) {
            throw new Error('Do not try to set the `JWT` value!');
        }
    }

}, {
    tableName: 'users'
});

// Before save the user hash the password in a hook, because it looks that getters and setters does not support asyc operations.
User.beforeCreate(async (user, options) => {
    // hash the password just before store the user in the database
    user.password = await createHashedPassword(user.password);
});

export default User;
