const express = require('express');
const router = express.Router();

const { authenticateJWT } = require('../middlewares/auth');

const userController = require('../controllers/userController');

router.post('/', authenticateJWT, userController.createProfile);
router.get('/', authenticateJWT, userController.getProfile);
router.get('/:id', authenticateJWT, userController.profileUser);
router.get('/search/user', authenticateJWT, userController.searchUser);

module.exports = router;

