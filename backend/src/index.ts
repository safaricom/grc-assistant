import * as dotenv from 'dotenv';
// Load environment variables at the very beginning
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import passport from './config/passport';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes';
import diAuthRoutes from './routes/diAuthRoutes';
import userRoutes from './routes/userRoutes';
import profileRoutes from './routes/profileRoutes';
import documentRoutes from './routes/documentRoutes';
import { ensureBucketExists } from './lib/s3';
import { connectDb } from './lib/db';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Support both FRONTEND_URL and FRONTEND_ORIGIN env var names (some configs use one or the other)
const frontendOrigin = process.env.FRONTEND_URL || process.env.FRONTEND_ORIGIN;
// If FRONTEND_URL is '*' or undefined, enable dynamic origin reflection for broader compatibility in deployments.
if (!frontendOrigin || frontendOrigin === '*') {
  app.use(cors({ origin: true, credentials: true }));
} else {
  app.use(cors({ origin: frontendOrigin, credentials: true }));
}
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
// app.use('/api/di-auth', diAuthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/documents', documentRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('GRC Assistant API is running!');
});


const startServer = async () => {
  try {
    await connectDb(); // Ensure DB is connected before starting
    await ensureBucketExists();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();