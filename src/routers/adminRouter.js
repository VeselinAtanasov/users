import express from 'express';

import { protect, adminPermission, userPermission } from '../middleware/authorizationMiddlewares.js';
import { createUser, deleteUser, getAllUsers, resetPassword } from '../controllers/adminController.js';

const router = express.Router();

router.post('/createUser', protect, adminPermission, createUser);
router.delete('/deleteUser/:id', protect, adminPermission, deleteUser);
router.get('/getAll', protect, adminPermission, getAllUsers);
router.update('/resetPassword', protect, adminPermission, resetPassword);

export default router;
