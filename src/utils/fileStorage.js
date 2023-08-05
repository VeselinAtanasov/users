import fs from 'fs';
import constants from '../constants/constants.js';
import ErrorResponse from './ErrorResponse.js';

export const saveFile = (file, path) => {
    return new Promise((resolve, reject) => {
        file.mv(`${path}/${file.name}`, async err => {
            if (err) {
                return reject(new ErrorResponse(constants.MESSAGE.ERROR_STORING_FILE, constants.STATUS_CODE.INTERNAL_SERVER_ERROR));
            }
            return resolve(true);
        });
    });
};

export const deleteFile = (pathToFile) => {
    return new Promise((resolve, reject) => {
        return fs.unlink(pathToFile, function (err) {
            if (err) {
                return reject(err);
            }
            console.log('Avatar Successfully deleted.');

            return resolve();
        });
    });
};
