const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const CrushingProcessing = require('./models/CrushingProcessing');

const seedCrushingData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminUser = await User.findOne({ email: 'admin@gme.com' });
        if (!adminUser) {
            console.log('Admin user not found, try running seed-test-data.js first.');
            process.exit(1);
        }

        let testBatch = await CrushingProcessing.findOne({ batchId: 'BATCH-001' });
        if (!testBatch) {
            testBatch = new CrushingProcessing({
                batchId: 'BATCH-001',
                rawMaterial: 'Quartz',
                inputQuantity: 1000,
                machineAssigned: 'Crusher Unit-1',
                outputGrade: 'Grade A',
                outputQuantity: 950,
                processingDate: new Date(),
                status: 'Completed',
                userId: adminUser._id
            });
            await testBatch.save();
            console.log('Crushing Processing batch BATCH-001 created');
        } else {
            console.log('Crushing Processing batch already exists');
        }

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedCrushingData();
