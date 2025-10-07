const Alumni = require('../models/Alumni');
const InviteToken = require('../models/InviteToken');
const { sendEmail } = require('../config/email');
const crypto = require('crypto');
const csv = require('csv-parser');
const fs = require('fs');
const XLSX = require('xlsx');

// Send invite to single alumni
const sendInvite = async (req, res) => {
  try {
    const { email } = req.body;
    const adminId = req.user._id;

    // Check if alumni already exists
    const existingAlumni = await Alumni.findOne({ email });
    if (existingAlumni) {
      return res.status(400).json({
        success: false,
        message: 'Alumni already registered with this email'
      });
    }

    // Check for existing unused token
    const existingToken = await InviteToken.findOne({
      email,
      used: false,
      expiresAt: { $gt: Date.now() }
    });

    if (existingToken) {
      return res.status(400).json({
        success: false,
        message: 'An invitation has already been sent to this email'
      });
    }

    // Create invite token
    const inviteToken = new InviteToken({
      email,
      createdBy: adminId
    });

    const token = crypto.randomBytes(32).toString('hex');
    inviteToken.token = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    await inviteToken.save();

    // Create registration link
    const registrationLink = `${process.env.FRONTEND_URL}/register/${token}`;

    // Send email
    const emailHtml = `
      <h2>Invitation to Join Alumni Network</h2>
      <p>Dear Alumni,</p>
      <p>You have been invited to join the GreonXpert Alumni Network.</p>
      <p>Please click the link below to create your account:</p>
      <a href="${registrationLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Create Account</a>
      <p>Or copy this link: ${registrationLink}</p>
      <p>This link will expire in 7 days.</p>
      <p>Best regards,<br>GreonXpert Team</p>
    `;

    const emailResult = await sendEmail({
      to: email,
      subject: 'Invitation to Join Alumni Network',
      html: emailHtml
    });

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: 'Invitation sent successfully'
      });
    } else {
      await InviteToken.deleteOne({ _id: inviteToken._id });
      res.status(500).json({
        success: false,
        message: 'Failed to send invitation email'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Send bulk invites
const sendBulkInvites = async (req, res) => {
  try {
    const adminId = req.user._id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    let emails = [];

    // Parse file based on type
    if (file.mimetype === 'text/csv') {
      // Parse CSV
      const results = [];
      fs.createReadStream(file.path)
        .pipe(csv())
        .on('data', (data) => {
          if (data.email) {
            results.push(data.email);
          }
        })
        .on('end', async () => {
          emails = results;
          await processBulkEmails(emails, adminId, res);
          fs.unlinkSync(file.path);
        });
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      // Parse Excel
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
      
      emails = data.map(row => row.email || row.Email).filter(Boolean);
      await processBulkEmails(emails, adminId, res);
      fs.unlinkSync(file.path);
    } else {
      fs.unlinkSync(file.path);
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Please upload CSV or Excel file'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Process bulk emails
const processBulkEmails = async (emails, adminId, res) => {
  const results = {
    success: [],
    failed: [],
    alreadyExists: []
  };

  for (const email of emails) {
    try {
      // Check if alumni already exists
      const existingAlumni = await Alumni.findOne({ email });
      if (existingAlumni) {
        results.alreadyExists.push(email);
        continue;
      }

      // Check for existing unused token
      const existingToken = await InviteToken.findOne({
        email,
        used: false,
        expiresAt: { $gt: Date.now() }
      });

      if (existingToken) {
        results.alreadyExists.push(email);
        continue;
      }

      // Create invite token
      const inviteToken = new InviteToken({
        email,
        createdBy: adminId
      });

      const token = crypto.randomBytes(32).toString('hex');
      inviteToken.token = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      await inviteToken.save();

      // Create registration link
      const registrationLink = `${process.env.FRONTEND_URL}/register/${token}`;

      // Send email
      const emailHtml = `
        <h2>Invitation to Join Alumni Network</h2>
        <p>Dear Alumni,</p>
        <p>You have been invited to join the GreonXpert Alumni Network.</p>
        <p>Please click the link below to create your account:</p>
        <a href="${registrationLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Create Account</a>
        <p>Or copy this link: ${registrationLink}</p>
        <p>This link will expire in 7 days.</p>
        <p>Best regards,<br>GreonXpert Team</p>
      `;

      const emailResult = await sendEmail({
        to: email,
        subject: 'Invitation to Join Alumni Network',
        html: emailHtml
      });

      if (emailResult.success) {
        results.success.push(email);
      } else {
        await InviteToken.deleteOne({ _id: inviteToken._id });
        results.failed.push(email);
      }
    } catch (error) {
      results.failed.push(email);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Bulk invitations processed',
    results
  });
};

// Get all alumni
const getAllAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.find()
      .select('-password')
      .populate('invitedBy', 'name email');

    res.status(200).json({
      success: true,
      count: alumni.length,
      alumni
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get alumni by department
const getAlumniByDepartment = async (req, res) => {
  try {
    const { department } = req.params;
    
    const alumni = await Alumni.find({ department })
      .select('-password')
      .populate('invitedBy', 'name email');

    res.status(200).json({
      success: true,
      count: alumni.length,
      alumni
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get alumni by batch
const getAlumniByBatch = async (req, res) => {
  try {
    const { batch } = req.params;
    
    const alumni = await Alumni.find({ batch })
      .select('-password')
      .populate('invitedBy', 'name email');

    res.status(200).json({
      success: true,
      count: alumni.length,
      alumni
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  sendInvite,
  sendBulkInvites,
  getAllAlumni,
  getAlumniByDepartment,
  getAlumniByBatch
};