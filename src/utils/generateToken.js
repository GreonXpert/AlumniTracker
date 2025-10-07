const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Generate JWT Token
const generateJWT = (id, role) => {
  return jwt.sign(
    { 
      id, 
      role,
      iat: Date.now()
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE || '7d',
      issuer: 'GreonXpert Alumni System'
    }
  );
};

// Generate Random Token
const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate Hashed Token
const generateHashedToken = (token) => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

// Generate OTP
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

// Generate unique ID
const generateUniqueId = (prefix = '') => {
  const timestamp = Date.now().toString(36);
  const randomStr = crypto.randomBytes(4).toString('hex');
  return prefix ? `${prefix}_${timestamp}${randomStr}` : `${timestamp}${randomStr}`;
};

// Verify JWT Token
const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateJWT,
  generateRandomToken,
  generateHashedToken,
  generateOTP,
  generateUniqueId,
  verifyJWT
};