const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.set('trust proxy', 1); // Trust first proxy (Railway/Nginx)

const allowedOrigins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined/null values

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Static folder for uploaded files
app.use('/uploads', express.static(uploadsDir));

// Routes
const authRoutes = require('./routes/auth');
const yardIntakeRoutes = require('./routes/yardIntake');
const crushingProcessingRoutes = require('./routes/crushingProcessing');
const assayingTestingRoutes = require('./routes/assayingTesting');
const inspectionCertificationRoutes = require('./routes/inspectionCertification');
const baggingWarehouseRoutes = require('./routes/baggingWarehouse');
const loadingDispatchRoutes = require('./routes/loadingDispatch');
const weighbridgeRoutes = require('./routes/weighbridge');
const transportationRoutes = require('./routes/transportation');
const exportDocumentationRoutes = require('./routes/exportDocumentation');
const invoiceRoutes = require('./routes/invoices');
const inventoryRoutes = require('./routes/inventory');
const clientRoutes = require('./routes/clients');
const userRoutes = require('./routes/users');
const companySettingsRoutes = require('./routes/companySettings');
const quotationRoutes = require('./routes/quotations');
const dashboardRoutes = require('./routes/dashboard');

// Middleware imports
const { protect } = require('./middleware/authMiddleware');

// Public Routes
app.use('/api/auth', authRoutes);
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'GME Backend is running', timestamp: new Date() });
});

// Protected Routes (Require Authentication)
app.use('/api/dashboard', protect, dashboardRoutes);
app.use('/api/yard-intake', protect, yardIntakeRoutes);
app.use('/api/crushing-processing', protect, crushingProcessingRoutes);
app.use('/api/assaying-testing', protect, assayingTestingRoutes);
app.use('/api/inspection-certification', protect, inspectionCertificationRoutes);
app.use('/api/bagging-warehouse', protect, baggingWarehouseRoutes);
app.use('/api/loading-dispatch', protect, loadingDispatchRoutes);
app.use('/api/weighbridge', protect, weighbridgeRoutes);
app.use('/api/transportation', protect, transportationRoutes);
app.use('/api/export-documentation', protect, exportDocumentationRoutes);
app.use('/api/invoices', protect, invoiceRoutes);
app.use('/api/inventory', protect, inventoryRoutes);
app.use('/api/clients', protect, clientRoutes);
app.use('/api/users', protect, userRoutes);
app.use('/api/company-settings', protect, companySettingsRoutes);
app.use('/api/quotations', protect, quotationRoutes);

// Basic Route (removed redundant line)

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
 
