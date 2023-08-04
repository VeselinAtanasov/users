import express from 'express';
import dotenv from 'dotenv';
import userRouter from '../src/routers/userRouter.js';

import { syncDb, syncModels } from './middleware/databaseMiddlewares.js';
import errorHandler from './middleware/errorMiddleware.js';

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

// middleware for testing the database connection
app.use(syncDb);

// middleware for synchronization the models
app.use(syncModels);

// middleware: body parser :
app.use(express.json());

// Mount the routers:
app.use('/users/', userRouter);

// use customer error handler, which will handle all uncaught errors .
// BUT MUST BE PLACED AFTER the routers were mount, so will handle errors from controllers!
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server is working and is listening on port: ${PORT}`));
