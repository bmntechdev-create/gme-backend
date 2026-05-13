const mongoose = require('mongoose');
const InventoryLog = require('../models/InventoryLog');
const User = require('../models/User');
require('dotenv').config();

const seedInventoryLogs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing logs
        await InventoryLog.deleteMany({});
        console.log('Cleared existing inventory logs');

        // Find a user
        const user = await User.findOne();
        if (!user) {
            console.error('No user found to link logs. Please create a user first.');
            process.exit(1);
        }

        const logs = [
            {
                batchId: 'BATCH-2024-001',
                inputQty: 1000,
                outputQty: 950,
                reason: 'Standard processing loss',
                userId: user._id
            },
            {
                batchId: 'BATCH-2024-002',
                inputQty: 2500,
                outputQty: 2480,
                reason: 'Moisture reduction',
                userId: user._id
            },
            {
                batchId: 'BATCH-2024-003',
                inputQty: 500,
                outputQty: 495,
                reason: 'Sample extraction',
                userId: user._id
            },
            {
                batchId: 'BATCH-2024-004',
                inputQty: 1200,
                outputQty: 1190,
                reason: 'Handling loss',
                userId: user._id
            },
            {
                batchId: 'BATCH-2024-005',
                inputQty: 3000,
                outputQty: 2975,
                reason: 'Refining process',
                userId: user._id
            }
        ];

        await InventoryLog.insertMany(logs);
        console.log('Successfully seeded 5 inventory logs');

        process.exit();
    } catch (error) {
        console.error('Error seeding inventory logs:', error);
        process.exit(1);
    }
};

seedInventoryLogs();
