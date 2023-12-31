import express from 'express';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import constants from './constants/constants.js';
import ErrorResponse from './utils/ErrorResponse.js';
import userRouter from '../src/routers/userRouter.js';
import adminRouter from '../src/routers/adminRouter.js';
import errorHandler from './middleware/errorHandlerMiddleware.js';
import { syncDb, syncModels } from './middleware/databaseMiddlewares.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

// middleware for testing the database connection
app.use(syncDb);

// middleware for synchronization the models
app.use(syncModels);

// middleware: cookie-parser
app.use(cookieParser());

// middleware: body parser :
app.use(express.json());

// add middleware for fileUpload:
app.use(fileUpload({
    limits: { fileSize: Number(process.env.AVATAR_SIZE) }
}));

// Mount the routers:
app.use('/users/', userRouter);
app.use('/admin/', adminRouter);

// Define Route for all requests which do not match :
app.use('*', (req, res) => res.status(constants.STATUS_CODE.NOT_FOUND).json(new ErrorResponse(constants.MESSAGE.ROUTE_NOT_FOUND, constants.STATUS_CODE.NOT_FOUND)));

// use customer error handler, which will handle all uncaught errors .
// should be last in the app so will handle errors from controllers!
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is working and is listening on port: ${PORT}`));
