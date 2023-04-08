const express = require('express')
const router = express.Router();
const postController = require('../controllers/postController');
const { authenticateJWT } = require('../middlewares/auth');

router.post('/', authenticateJWT, postController.createPost);
router.get('/:uid', authenticateJWT, postController.getPosts);
router.post('/tag/:id', authenticateJWT, postController.tagCreate);
router.get('/view/:id', authenticateJWT, postController.viewPost);
router.get('/tagged/post', authenticateJWT, postController.listTagPost);

module.exports = router;