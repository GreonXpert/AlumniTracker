const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  sendInvite,
  sendBulkInvites,
  getAllAlumni,
  getAlumniByDepartment,
  getAlumniByBatch
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

router.use(protect);
router.use(authorize('admin', 'super_admin'));

router.post('/invite', sendInvite);
router.post('/invite/bulk', upload.single('file'), sendBulkInvites);
router.get('/alumni', getAllAlumni);
router.get('/alumni/department/:department', getAlumniByDepartment);
router.get('/alumni/batch/:batch', getAlumniByBatch);

module.exports = router;