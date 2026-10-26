import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

import { PORT, CLIENT_ORIGIN, DEMO_MODE, NODE_ENV } from './config/environment.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import healthRoutes from './routes/health.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Security HTTP headers
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Global API rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});
app.use('/api', globalLimiter);

// Mount API routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'VIT Campus Placement Tracker Backend API',
    college: 'Vishnu Institute of Technology, Bhimavaram',
    health: '/api/health',
    demoMode: DEMO_MODE
  });
});

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found`
  });
});

// Central error handler
app.use(errorHandler);

// Connect to MongoDB and start server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 VIT Placement Tracker Server running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`🌐 Allowed Client Origin: ${CLIENT_ORIGIN}`);
    console.log(`🔧 Demo Mode: ${DEMO_MODE ? 'ENABLED (OTP: 123456)' : 'DISABLED'}`);
    console.log(`======================================================\n`);
  });
};

startServer();

export default app;
