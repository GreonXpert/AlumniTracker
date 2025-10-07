const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'comments.onModel'
  },
  onModel: {
    type: String,
    required: true,
    enum: ['Admin', 'SuperAdmin', 'Alumni']
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
}, {
  timestamps: true
});

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'onModel'
  },
  onModel: {
    type: String,
    required: true,
    enum: ['Admin', 'SuperAdmin', 'Alumni']
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true
  },
  images: [{
    type: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'onModel'
  }],
  comments: [commentSchema],
  shares: [{
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'onModel'
  }],
  visibility: {
    type: String,
    enum: ['public', 'alumni', 'connections', 'private'],
    default: 'public'
  },
  isEdited: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
