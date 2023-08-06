import fs from 'fs';
import constants from '../constants/constants.js';
import ErrorResponse from './ErrorResponse.js';

export const saveFile = (user, file, pathToPublicDir) => {
    return new Promise((resolve, reject) => {
        // create directory(if not exists) with name first later of the username and store the file there
        const customDir = `${pathToPublicDir}/${user.username.substring(0, 1)}`;

        fs.mkdir(customDir, { recursive: true }, (err) => {
            if (err) {
                return reject(new ErrorResponse(constants.MESSAGE.ERROR_STORING_FILE_CREATE_DIR, constants.STATUS_CODE.INTERNAL_SERVER_ERROR));
            }
            // save the file
            file.mv(`${customDir}/${file.name}`, (err) => {
                if (err) {
                    return reject(new ErrorResponse(constants.MESSAGE.ERROR_STORING_FILE, constants.STATUS_CODE.INTERNAL_SERVER_ERROR));
                }
                return resolve(true);
            });
        });
    });
};
export const deleteFile = (/* pathToFile */ user, pathToPublicDir) => {
    const pathToFile = `${pathToPublicDir}/${user.username.substring(0, 1)}/${user.avatar}`;
    // delete the file from directory
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
