import express from 'express';

import { register, login, logout, getProfile, updateProfile, getOwnFriends, addOwnFriend, removeOwnFriend } from '../controllers/userController.js';
import { protect, userPermission } from '../middleware/authorizationMiddlewares.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect, logout);

router.route('/profile')
    .get(protect, getProfile)
    .put(protect, updateProfile);

// only role = user can have friends
router.route('/friends')
    .get(protect, userPermission, getOwnFriends)
    .put(protect, userPermission, addOwnFriend)
    .post(protect, userPermission, removeOwnFriend);

export default router;
