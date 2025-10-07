const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  likePost,
  commentPost,
  updatePost,
  deletePost,
  savePost,
  sharePost
} = require('../controllers/feedController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.route('/posts')
  .post(upload.array('images', 5), createPost)
  .get(getPosts);

router.route('/posts/:postId')
  .get(getPost)
  .put(upload.array('images', 5), updatePost) // <-- enable images on update
  .delete(deletePost);

router.post('/posts/:postId/like', likePost);
router.post('/posts/:postId/comment', commentPost);
router.post('/posts/:postId/save', savePost);
router.post('/posts/:postId/share', sharePost);

module.exports = router;
