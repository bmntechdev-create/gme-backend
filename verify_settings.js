const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const CompanySettings = require('./models/CompanySettings');

async function verify() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        let settings = await CompanySettings.findOne();
        if (!settings) {
            console.log('No settings found. Creating one...');
            settings = new CompanySettings({
                name: 'Test Company',
                address: 'Test Address',
                rcNumber: 'RC123',
                tin: 'TIN123',
                phone: '123',
                email: 'test@test.com'
            });
            await settings.save();
        }

        console.log('Current settings:', JSON.stringify(settings, null, 2));

        const newType = 'Test Inspection Type ' + Date.now();
        console.log('Adding new inspection type:', newType);

        const updatedList = [...(settings.inspectionTypes || []), newType];

        const updatedSettings = await CompanySettings.findOneAndUpdate(
            {},
            { inspectionTypes: updatedList },
            { returnDocument: 'after' }
        );

        console.log('Updated settings:', JSON.stringify(updatedSettings, null, 2));

        if (updatedSettings.inspectionTypes.includes(newType)) {
            console.log('SUCCESS: Inspection type verified as added.');
        } else {
            console.log('FAILURE: Inspection type not found in updated document.');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

verify();
