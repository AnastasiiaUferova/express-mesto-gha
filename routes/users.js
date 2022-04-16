const router = require('express').Router();
const { getUserById, createUser, getAllUsers, changeUserInfo, changeUserAvatar } = require('../controllers/users');

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.get('/users/:userId', getUserById);
router.patch('/users/me', changeUserInfo);
router.patch('/users/me/avatar', changeUserAvatar);


module.exports = router;