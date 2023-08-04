import express from 'express';

import { register, login, logout, getProfile, updateProfile, getFriends, addFriend, removeFriend } from '../controllers/userController.js';
import { protect, adminPermission, userPermission } from '../middleware/authorizationMiddlewares.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect, logout);

router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);

// only role = user can have friends
router.route('/friends')
    .get(protect, userPermission, getFriends)
    .put(protect, userPermission, addFriend)
    .delete(protect, userPermission, removeFriend);

export default router;
