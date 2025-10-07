const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addExperience,
  updateExperience,
  deleteExperience,
  addEducation,
  updateEducation,
  deleteEducation,
  addCourse,
  updateCourse,
  deleteCourse,
  changePassword
} = require('../controllers/alumniController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('alumni'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', changePassword);

router.post('/experience', addExperience);
router.put('/experience/:experienceId', updateExperience);
router.delete('/experience/:experienceId', deleteExperience);

router.post('/education', addEducation);
router.put('/education/:educationId', updateEducation);
router.delete('/education/:educationId', deleteEducation);

router.post('/course', addCourse);
router.put('/course/:courseId', updateCourse);
router.delete('/course/:courseId', deleteCourse);

module.exports = router;