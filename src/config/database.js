const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);

    // Create Super Admin on first run
    const SuperAdmin = require('../models/SuperAdmin');
    const bcrypt = require('bcryptjs');
    
    const superAdminExists = await SuperAdmin.findOne({ 
      email: process.env.SUPER_ADMIN_EMAIL 
    });
    
    if (!superAdminExists) {
      const hashedPassword = await bcrypt.hash(
        process.env.SUPER_ADMIN_PASSWORD, 
        10
      );
      
      await SuperAdmin.create({
        name: process.env.SUPER_ADMIN_NAME,
        email: process.env.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        role: process.env.SUPER_ADMIN_ROLE
      });
      
      console.log('Super Admin created successfully'.green.bold);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = connectDB;