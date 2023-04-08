// like routes

const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const { authenticateJWT } = require('../middlewares/auth');

router.post('/', authenticateJWT, likeController.createLike);
router.delete('/:id', authenticateJWT, likeController.deleteLike);
router.get('/:id', authenticateJWT, likeController.getLikes);

module.exports = router;