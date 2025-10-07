const mongoose = require('mongoose');
const crypto = require('crypto');

const inviteTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  used: {
    type: Boolean,
    default: false
  },
  usedAt: Date,
  expiresAt: {
    type: Date,
    default: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  }
}, {
  timestamps: true
});

inviteTokenSchema.methods.generateToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.token = crypto.createHash('sha256').update(token).digest('hex');
  return token;
};

module.exports = mongoose.model('InviteToken', inviteTokenSchema);