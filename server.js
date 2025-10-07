const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const colors = require('colors');
const path = require('path');

// Load env vars
dotenv.config();

// Import DB connection and routes
const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const alumniRoutes = require('./src/routes/alumniRoutes');
const superAdminRoutes = require('./src/routes/superAdminRoutes');
const feedRoutes = require('./src/routes/feedRoutes');
const errorHandler = require('./src/middleware/errorHandler');

// Connect to database
connectDB();

const app = express();

// --- CRUCIAL FIX: Global CORS Configuration ---
// This must come before your routes and static file serving.
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://stately-licorice-25d7bf.netlify.app',
  credentials: true
}));

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: false, // This helps in allowing images to be loaded cross-origin
}));


// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- SERVE UPLOADED FILES ---
// This serves the 'uploads' folder as a static directory.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/feed', feedRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler for any unhandled routes
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Not Found" });
});


// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});