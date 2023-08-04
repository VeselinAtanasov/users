import express from 'express';

import { protect, adminPermission } from '../middleware/authorizationMiddlewares.js';
import { createUser, deleteUser, getAllUsers, resetPassword, getOneUserById } from '../controllers/adminController.js';

const router = express.Router();

router.post('/createUser', protect, adminPermission, createUser);
router.delete('/deleteUser/:id', protect, adminPermission, deleteUser);
router.get('/getAll', protect, adminPermission, getAllUsers);
router.get('/getOne/:id', protect, adminPermission, getOneUserById);
router.put('/resetPassword', protect, adminPermission, resetPassword);

export default router;
