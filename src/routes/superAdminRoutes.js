const express = require('express');
const router = express.Router();
const {
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  getStatistics,
  getAllInvitations
} = require('../controllers/superAdminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('super_admin'));

router.post('/admin', createAdmin);
router.get('/admins', getAllAdmins);
router.put('/admin/:adminId', updateAdmin);
router.delete('/admin/:adminId', deleteAdmin);
router.get('/statistics', getStatistics);
router.get('/invitations', getAllInvitations);

module.exports = router;