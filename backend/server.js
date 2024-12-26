const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const businessRoutes = require('./routes/businessRoutes');
const operationsRoutes = require('./routes/operationsRoutes');

// Initialize environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/operations', operationsRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/schedule', scheduleRoutes);

// Default route
app.get('/', (req, res) => res.send('Shift Happens API is running!'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));