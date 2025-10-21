import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// app.use('../.env')

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/api/auth', authRoutes);
app.use('/api/api/portfolio', portfolioRoutes);
app.use('/api/api/stocks', stockRoutes);
app.use('/api/api/orders', orderRoutes);

// Global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campus_exchange';

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

start();

