export default {
    STATUS_CODE: {
        SUCCESS: 200,
        CREATED: 201,
        REMOVED: 204,
        INTERNAL_SERVER_ERROR: 500,
        BAD_REQUEST: 400,
        NOT_AUTHORIZED: 401,
        FORBIDDEN: 403,
        SERVICE_UNAVAILABLE: 503,
        NOT_FOUND: 404
    },
    MESSAGE: {
        SUCCESS_LOGIN: 'Successful Login',
        SUCCESS_REGISTRATION: 'Successful Registration',
        SUCCESS_LOGOUT: 'Successful Logout',
        INVALID_CREDENTIALS: 'Invalid Credentials',
        PROFILE_RETRIEVED: 'Own Profile Retrieved',
        MODEL_NOT_SYNCED: 'Models are not synchronized!',
        WRONG_INPUT: 'Wrong name of the inputs parameters',
        DB_DOWN: 'Database is down or it is not created!',
        NOT_AUTHORIZED: 'Not authorized to access this route',
        PASSWORD_CHANGE_NOT_ALLOWED: 'User is not allowed to change the password.',
        ROLE_CHANGE_NOT_ALLOWED: 'User is not allowed to change it`s role. Only Admin can',
        ONLY_FOR_ADMIN: 'Not authorized to access this route - only Admins are allowed',
        ONLY_FOR_USERS: 'Not authorized to access this route - only Users are allowed',
        INVALID_TOKEN: 'Invalid Token',
        NO_ACCESS_TO_ROUTE: 'Not authorized to access this route',
        PROFILE_UPDATED: 'The user profile has been updated',
        FRIENDS_NOT_ALLOWED: 'The user you are trying to register is with role: admin. It is not allowed to add friends!',
        USER_FRIENDS: 'Friends List Retrieved!',
        FRIEND_ADDED: 'Friend has been added!',
        FRIENDS_LIMIT_REACHED: 'Maximum number of friends in own list is reached!',
        WRONG_FRIEND: 'You are trying to add yourself as friend!',
        FRIEND_REMOVED: 'You just removed a friend from your list',
        USER_CREATED_BY_ADMIN: 'User successfully created!',
        MISSING_USER: 'The user does not exist in the database',
        USER_DELETED: 'Use deleted!',
        USER_RETRIEVED: 'User along with it`s friends is retrieved!',
        USERS_RETRIEVED: 'Users retrieved!'
    }

};
