// Middleware , which will overwrite the global one and will try to handle all errors

import ErrorResponse from '../utils/ErrorResponse.js';
import constants from '../constants/constants.js';

export default (err, req, res, next) => {
    // work with copy of the error, thus will have access to original error message and can modify the copy
    let error = { ...err };
    error.message = err.message;

    // Postgres error for duplicate value
    if (err.name === 'SequelizeUniqueConstraintError') {
        const message = Object.values(err.errors).map((e) => e.message);
        error = new ErrorResponse(message, 400);
    }

    // Handle validation error:
    if (err.name === 'ValidationError' || err.name === 'SequelizeValidationError') {
        const message = Object.values(err.errors).map((e) => e.message);
        error = new ErrorResponse(message, 400);
    }

    if (err.name === 'SequelizeConnectionError') {
        error = new ErrorResponse(constants.MESSAGE.CONNECTION_ERROR, 400);
    }

    if (err.name === 'TypeError') {
        error = new ErrorResponse(constants.MESSAGE.TYPE_ERROR, 500);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || constants.MESSAGE.INTERNAL_SERVER_ERROR
        // e: err
    });
};
