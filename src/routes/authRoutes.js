const express = require('express');
const router = express.Router();
const {
  login,
  registerAlumni,
  verifyInviteToken
} = require('../controllers/authController');

router.post('/login', login);
router.get('/invite/verify/:token', verifyInviteToken);
router.post('/register/alumni/:token', registerAlumni);

module.exports = router;