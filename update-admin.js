const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const updateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const admin = await User.findOne({ email: 'admin@gme.com' });
        if (!admin) {
            console.log('Admin not found, creating new one');
            const newAdmin = new User({
                name: 'System Admin',
                email: 'admin@gme.com',
                password: 'admin123',
                role: 'Admin',
                initials: 'SA',
                department: 'Administration',
                status: 'Active'
            });
            await newAdmin.save();
        } else {
            admin.password = 'admin123';
            await admin.save();
            console.log('Admin password updated to admin123');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error updating admin:', error);
        process.exit(1);
    }
};

updateAdmin();
