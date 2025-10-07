const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Alumni = require('../models/Alumni');
const Admin = require('../models/Admin');
const SuperAdmin = require('../models/SuperAdmin');
const InviteToken = require('../models/InviteToken');
const { sendEmail } = require('../config/email');

const generateJWT = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Login for all users
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    let user;
    let role;

    // Check SuperAdmin
    user = await SuperAdmin.findOne({ email }).select('+password');
    if (user) {
      role = 'super_admin';
    }

    // Check Admin
    if (!user) {
      user = await Admin.findOne({ email, isActive: true }).select('+password');
      if (user) {
        role = 'admin';
      }
    }

    // Check Alumni
    if (!user) {
      user = await Alumni.findOne({ email, isActive: true }).select('+password');
      if (user) {
        role = 'alumni';
      }
    }

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateJWT(user._id, role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role,
        department: user.department || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Register Alumni with invite token
const registerAlumni = async (req, res) => {
  try {
    const { token } = req.params;
    const {
      name,
      email,
      password,
      batch,
      department,
      occupation
    } = req.body;

    // Verify invite token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const inviteToken = await InviteToken.findOne({
      token: hashedToken,
      used: false,
      expiresAt: { $gt: Date.now() }
    });

    if (!inviteToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired invitation token'
      });
    }

    // Check if email matches
    if (inviteToken.email !== email) {
      return res.status(400).json({
        success: false,
        message: 'Email does not match invitation'
      });
    }

    // Check if alumni already exists
    const existingAlumni = await Alumni.findOne({ email });
    if (existingAlumni) {
      return res.status(400).json({
        success: false,
        message: 'Alumni already registered'
      });
    }

    // Create alumni
    const alumni = await Alumni.create({
      name,
      email,
      password,
      batch,
      department,
      occupation,
      invitedBy: inviteToken.createdBy,
      isEmailVerified: true
    });

    // Mark token as used
    inviteToken.used = true;
    inviteToken.usedAt = Date.now();
    await inviteToken.save();

    // Send welcome email
    const emailHtml = `
      <h2>Welcome to Alumni Network!</h2>
      <p>Dear ${name},</p>
      <p>Your account has been successfully created.</p>
      <p>You can now login and update your profile.</p>
      <p>Best regards,<br>GreonXpert Team</p>
    `;

    await sendEmail({
      to: email,
      subject: 'Welcome to Alumni Network',
      html: emailHtml
    });

    const jwtToken = generateJWT(alumni._id, 'alumni');

    res.status(201).json({
      success: true,
      message: 'Alumni registered successfully',
      token: jwtToken,
      alumni: {
        id: alumni._id,
        name: alumni.name,
        email: alumni.email,
        role: 'alumni'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Verify invite token
const verifyInviteToken = async (req, res) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const inviteToken = await InviteToken.findOne({
      token: hashedToken,
      used: false,
      expiresAt: { $gt: Date.now() }
    });

    if (!inviteToken) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired invitation token'
      });
    }

    res.status(200).json({
      success: true,
      email: inviteToken.email
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  login,
  registerAlumni,
  verifyInviteToken
};