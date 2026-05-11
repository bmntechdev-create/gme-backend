const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Client = require('./models/Client');
const YardIntake = require('./models/YardIntake');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Allow bypassing password hashing for seeding
        User.schema.pre('save', function (next) {
            next();
        });

        // Add dummy Admin
        let testAdmin = await User.findOne({ email: 'admin@gme.com' });
        if (!testAdmin) {
            testAdmin = new User({
                name: 'System Admin',
                email: 'admin@gme.com',
                password: 'password123',
                role: 'Admin',
                department: 'Management',
                status: 'Active',
                initials: 'SA'
            });
            await testAdmin.save();
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }

        // Add dummy Client
        let testClient = await Client.findOne({ tin: 'TIN-001' });
        if (!testClient) {
            testClient = new Client({
                name: 'Acme Mining Corp',
                address: '123 Industrial Park, City',
                tin: 'TIN-001',
                phone: '+1 555 123 4567',
                email: 'contact@acmemining.com',
                registrationDate: '2026-01-01',
                status: 'Active',
                primaryContact: 'John Doe',
                industry: 'Mining',
                userId: testAdmin._id
            });
            await testClient.save();
            console.log('Client Acme Mining Corp created');
        } else {
            console.log('Client already exists');
        }

        // Add dummy Yard Intake
        let testIntake = await YardIntake.findOne({ grnNumber: 'GRN-001' });
        if (!testIntake) {
            testIntake = new YardIntake({
                supplierName: 'Acme Mining Corp',
                vehicleNumber: 'TRK-1234',
                materialType: 'Iron Ore',
                grossWeight: 50000,
                tareWeight: 15000,
                netWeight: 35000,
                grnNumber: 'GRN-001',
                status: 'Paid',
                userId: testAdmin._id
            });
            await testIntake.save();
            console.log('Yard Intake GRN-001 created');
        } else {
            console.log('Yard Intake already exists');
        }

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
