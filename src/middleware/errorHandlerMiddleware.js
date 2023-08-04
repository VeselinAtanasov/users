// Middleware , which will overwrite the global one and will try to handle all errors

import ErrorResponse from '../utils/ErrorResponse.js';
import constants from '../constants/constants.js';

export default (err, req, res, next) => {
    // work with copy of the error, thus will have access to original error message and can modify the copy
    let error = { ...err };
    error.message = err.message;

    console.log('=== Error From ErrorHandler: ', err);
    console.log('=== Error NAME: ' + err.name);

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
        error = new ErrorResponse('Connection Error. Service Unavailable', 400);
    }

    if (err.name === 'TypeError') {
        error = new ErrorResponse('TypeError', 500);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
        e: err
    });
};
