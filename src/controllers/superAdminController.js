const Admin = require('../models/Admin');
const Alumni = require('../models/Alumni');
const InviteToken = require('../models/InviteToken');

// Create Admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists with this email'
      });
    }

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password,
      department,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        department: admin.department,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ deletedAt: null })
      .select('-password')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      count: admins.length,
      admins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update admin
const updateAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;
    const updates = req.body;

    // Don't allow password update through this route
    delete updates.password;
    delete updates.role;
    delete updates.createdBy;

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      updates,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Soft delete admin
const deleteAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findById(adminId);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    admin.isActive = false;
    admin.deletedAt = Date.now();
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get statistics
const getStatistics = async (req, res) => {
  try {
    const totalAdmins = await Admin.countDocuments({ deletedAt: null });
    const totalAlumni = await Alumni.countDocuments();
    const activeAlumni = await Alumni.countDocuments({ isActive: true });
    const pendingInvites = await InviteToken.countDocuments({
      used: false,
      expiresAt: { $gt: Date.now() }
    });

    // Department wise count
    const departmentStats = await Alumni.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      }
    ]);

    // Batch wise count
    const batchStats = await Alumni.aggregate([
      {
        $group: {
          _id: '$batch',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalAdmins,
        totalAlumni,
        activeAlumni,
        pendingInvites,
        departmentStats,
        batchStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all invitations
const getAllInvitations = async (req, res) => {
  try {
    const invitations = await InviteToken.find()
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: invitations.length,
      invitations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  getStatistics,
  getAllInvitations
};