const Post = require('../models/Post');
const Alumni = require('../models/Alumni');
const Admin = require('../models/Admin');
const SuperAdmin = require('../models/SuperAdmin');

// @desc    Create a new post
// @route   POST /api/feed/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { content, tags, visibility } = req.body;

    const images = req.files ? req.files.map(file => file.path.replace(/\\/g, "/")) : [];

    if ((!content || content.trim() === '<p><br></p>') && images.length === 0) {
      return res.status(400).json({ success: false, message: 'Post content cannot be empty' });
    }

    const post = await Post.create({
      content,
      tags: tags ? JSON.parse(tags) : [],
      visibility,
      images,
      author: req.user._id,
      onModel: req.user.role === 'alumni' ? 'Alumni' : req.user.role === 'admin' ? 'Admin' : 'SuperAdmin'
    });

    await post.populate('author', 'name profilePicture occupation role');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get posts (supports filter & search)
// @route   GET /api/feed/posts
// @access  Private
exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const filter = (req.query.filter || 'all').toString();
    const search = (req.query.search || '').toString().trim();

    const query = {};

    // My Posts filter
    if (filter === 'my-posts') {
      query.author = req.user._id;
    }

    // Search in content and tags (case-insensitive)
    if (search.length > 0) {
      query.$or = [
        { content: { $regex: search, $options: 'i' } },
        { tags: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }

    const [posts, totalPosts] = await Promise.all([
      Post.find(query)
        .populate('author', 'name profilePicture occupation role')
        .populate({ path: 'comments.author', select: 'name profilePicture' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(query)
    ]);

    const postsWithLikeStatus = posts.map(post => ({
      ...post.toObject(),
      isLiked: post.likes.some(id => id.toString() === req.user._id.toString())
    }));

    res.status(200).json({
      success: true,
      posts: postsWithLikeStatus,
      hasMore: (page * limit) < totalPosts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single post by ID
// @route   GET /api/feed/posts/:postId
// @access  Private
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate('author', 'name profilePicture occupation role')
      .populate('comments.author', 'name profilePicture');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like or unlike a post
// @route   POST /api/feed/posts/:postId/like
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const userId = req.user._id.toString();
    const idx = post.likes.findIndex(id => id.toString() === userId);

    let isLikedNow;
    if (idx > -1) {
      post.likes.splice(idx, 1);
      isLikedNow = false;
    } else {
      post.likes.push(req.user._id);
      isLikedNow = true;
    }

    await post.save();

    res.status(200).json({ success: true, likes: post.likes, isLiked: isLikedNow });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Comment on a post
// @route   POST /api/feed/posts/:postId/comment
// @access  Private
exports.commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const comment = {
      content: req.body.comment,
      author: req.user._id,
      onModel: req.user.role === 'alumni' ? 'Alumni' : req.user.role === 'admin' ? 'Admin' : 'SuperAdmin'
    };

    post.comments.push(comment);
    await post.save();

    await post.populate({ path: 'comments.author', select: 'name profilePicture' });

    res.status(201).json({ success: true, comments: post.comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a post (supports image edits)
// @route   PUT /api/feed/posts/:postId
// @access  Private
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    // Ownership check
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'User not authorized' });
    }

    // Parse incoming body
    let { content, tags, visibility, existingImages } = req.body;

    try {
      if (typeof tags === 'string') tags = JSON.parse(tags);
    } catch (_) {}

    try {
      if (typeof existingImages === 'string') existingImages = JSON.parse(existingImages);
    } catch (_) {}

    const uploaded = req.files ? req.files.map(f => f.path.replace(/\\/g, "/")) : [];
    const keep = Array.isArray(existingImages) ? existingImages : post.images || [];

    // If user clears content + images entirely, block empty post
    if ((!content || content.trim() === '<p><br></p>') && keep.length + uploaded.length === 0) {
      return res.status(400).json({ success: false, message: 'Post cannot be empty' });
    }

    post.content = (content !== undefined) ? content : post.content;
    post.tags = Array.isArray(tags) ? tags : post.tags;
    post.visibility = visibility || post.visibility;
    post.images = [...keep, ...uploaded];
    post.isEdited = true;

    await post.save();
    await post.populate('author', 'name profilePicture occupation role');
    await post.populate({ path: 'comments.author', select: 'name profilePicture' });

    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/feed/posts/:postId
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'User not authorized' });
    }

    // TODO: Optionally remove files from disk

    await post.deleteOne();
    res.status(200).json({ success: true, message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Placeholders (not implemented yet)
exports.savePost = async (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented' });
};
exports.sharePost = async (req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented' });
};
  