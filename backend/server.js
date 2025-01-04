const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const businessRoutes = require('./routes/businessRoutes');
const operationsRoutes = require('./routes/operationsRoutes');
const eventRoutes = require('./routes/eventRoutes');

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
app.use('/api/events', eventRoutes);

// Default route
app.get('/', (req, res) => res.send('Shift Happens API is running!'));

// Export the app for testing
module.exports = app;

// Start the server only if not in testing mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}