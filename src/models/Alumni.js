const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const experienceSchema = new mongoose.Schema({
  company: String,
  position: String,
  startDate: Date,
  endDate: Date,
  description: String,
  isCurrent: {
    type: Boolean,
    default: false
  }
});

const educationSchema = new mongoose.Schema({
  institution: String,
  degree: String,
  field: String,
  startDate: Date,
  endDate: Date,
  grade: String
});

const courseSchema = new mongoose.Schema({
  courseName: String,
  institution: String,
  completionDate: Date,
  certificate: String
});

const alumniSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  batch: {
    type: String,
    required: [true, 'Please add batch year']
  },
  department: {
    type: String,
    required: [true, 'Please add department']
  },
  occupation: {
    type: String,
    required: [true, 'Please add current occupation']
  },
  phone: String,
  address: String,
  city: String,
  state: String,
  country: String,
  linkedIn: String,
  github: String,
  portfolio: String,
  experiences: [experienceSchema],
  education: [educationSchema],
  courses: [courseSchema],
  skills: [String],
  achievements: [String],
  profilePicture: String,
  bio: String,
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  savedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  role: {
    type: String,
    default: 'alumni',
    immutable: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

alumniSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

alumniSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Alumni', alumniSchema);
