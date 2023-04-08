const express = require('express')
const router = express.Router();
const followController = require('../controllers/followController');
const { authenticateJWT } = require('../middlewares/auth');

router.post('/', authenticateJWT, followController.follow);
router.get('/:uid', authenticateJWT, followController.getFollowers);
router.get('/following/:uid', authenticateJWT, followController.getFollowing);
router.post('/unfollow', authenticateJWT, followController.unfollow);
router.post('/remove', authenticateJWT, followController.removeFollower);
router.delete('/request/remove/:id', authenticateJWT, followController.followRequestRemove);
router.patch('/request/accept/:id', authenticateJWT, followController.followRequestAccept);
router.delete('/request/reject/:id', authenticateJWT, followController.followRequestReject)
router.get('/request', authenticateJWT, followController.getFollowRequests);
router.get('/request/sent', authenticateJWT, followController.getSentFollowRequests);

module.exports = router;
