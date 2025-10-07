const Alumni = require('../models/Alumni');

// Get alumni profile
const getProfile = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.user._id)
      .select('-password')
      .populate('invitedBy', 'name email');

    res.status(200).json({
      success: true,
      alumni
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update alumni profile
const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      'name',
      'phone',
      'address',
      'city',
      'state',
      'country',
      'linkedIn',
      'github',
      'portfolio',
      'bio',
      'occupation',
      'skills',
      'achievements'
    ];

    const updates = {};
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const alumni = await Alumni.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      alumni
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add experience
const addExperience = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.user._id);
    
    const experience = {
      company: req.body.company,
      position: req.body.position,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      description: req.body.description,
      isCurrent: req.body.isCurrent || false
    };

    alumni.experiences.push(experience);
    await alumni.save();

    res.status(201).json({
      success: true,
      message: 'Experience added successfully',
      experiences: alumni.experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update experience
const updateExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;
    
    const alumni = await Alumni.findById(req.user._id);
    
    const experience = alumni.experiences.id(experienceId);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    Object.assign(experience, req.body);
    await alumni.save();

    res.status(200).json({
      success: true,
      message: 'Experience updated successfully',
      experiences: alumni.experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete experience
const deleteExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;
    
    const alumni = await Alumni.findById(req.user._id);
    
    alumni.experiences.pull(experienceId);
    await alumni.save();

    res.status(200).json({
      success: true,
      message: 'Experience deleted successfully',
      experiences: alumni.experiences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add education
const addEducation = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.user._id);
    
    const education = {
      institution: req.body.institution,
      degree: req.body.degree,
      field: req.body.field,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      grade: req.body.grade
    };

    alumni.education.push(education);
    await alumni.save();

    res.status(201).json({
      success: true,
      message: 'Education added successfully',
      education: alumni.education
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update education
const updateEducation = async (req, res) => {
  try {
    const { educationId } = req.params;
    
    const alumni = await Alumni.findById(req.user._id);
    
    const education = alumni.education.id(educationId);
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found'
      });
    }

    Object.assign(education, req.body);
    await alumni.save();

    res.status(200).json({
      success: true,
      message: 'Education updated successfully',
      education: alumni.education
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete education
const deleteEducation = async (req, res) => {
  try {
    const { educationId } = req.params;
    
    const alumni = await Alumni.findById(req.user._id);
    
    alumni.education.pull(educationId);
    await alumni.save();

    res.status(200).json({
      success: true,
      message: 'Education deleted successfully',
      education: alumni.education
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add course
const addCourse = async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.user._id);
    
    const course = {
      courseName: req.body.courseName,
      institution: req.body.institution,
      completionDate: req.body.completionDate,
      certificate: req.body.certificate
    };

    alumni.courses.push(course);
    await alumni.save();

    res.status(201).json({
      success: true,
      message: 'Course added successfully',
      courses: alumni.courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update course
const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const alumni = await Alumni.findById(req.user._id);
    
    const course = alumni.courses.id(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    Object.assign(course, req.body);
    await alumni.save();

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      courses: alumni.courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const alumni = await Alumni.findById(req.user._id);
    
    alumni.courses.pull(courseId);
    await alumni.save();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
      courses: alumni.courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const alumni = await Alumni.findById(req.user._id).select('+password');

    const isMatch = await alumni.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    alumni.password = newPassword;
    await alumni.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
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
};