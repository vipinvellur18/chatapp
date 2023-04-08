const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { authenticateJWT } = require('../middlewares/auth');

router.post('/:id', authenticateJWT, commentController.createComment);
router.get('/:id', authenticateJWT, commentController.getComments);
router.post('/replay/:id', authenticateJWT, commentController.createReply);
router.get('/replay/:id', authenticateJWT, commentController.getReplies);
router.delete('/:id', authenticateJWT, commentController.deleteComment);
router.delete('/replay/:id', authenticateJWT, commentController.deleteReply);

module.exports = router;