const CompanySettings = require('../models/CompanySettings');

// @desc    Get company settings
// @route   GET /api/company-settings
// @access  Private
exports.getSettings = async (req, res) => {
    try {
        let settings = await CompanySettings.findOne();
        if (!settings) {
            settings = new CompanySettings({
                name: 'GME Interchange',
                address: 'Behind FRSC Interchange Emergency Clinic, Sagamu Road, Ogun State, Nigeria',
                rcNumber: 'RC-12345678',
                tin: '27AABCU9603R1ZX',
                phone: '+234-916-268-7000',
                email: 'operations@gmeinterchange.com',
                logo: '/src/assets/gme_logo.png',
                vatPercentage: 7.5,
                defaultDiscountType: 'Percentage',
                defaultDiscountValue: 0,
                materialTypes: ['Lithium Ore', 'Tin Ore', 'Tantalite', 'Iron Ore Fines', 'Quartz', 'Feldspar', 'Bauxite', 'Kaolin', 'Mica', 'Lead Ore', 'Zinc Ore'],
                laboratories: ['CCBC Testing Laboratory', 'SGS India Pvt Ltd', 'Intertek Testing', 'Bureau Veritas'],
                inspectionTypes: ['Pre-Shipment', 'Quality Check', 'Compliance Audit'],
                machines: ['Crusher Unit-1', 'Crusher Unit-2', 'Crusher Unit-3'],
                vehicles: ['KL-07-AB-1234', 'KL-01-XY-5678', 'TN-38-BZ-9012'],
                inspectors: ['John Doe', 'Jane Smith', 'Richard Roe'],
                destinations: ['Lagos Port', 'Port Harcourt', 'Kano Inland Port'],
                warehouses: ['Warehouse-A', 'Warehouse-B', 'Warehouse-C'],
                currency: 'AED'
            });
            await settings.save();
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update company settings
// @route   PATCH /api/company-settings
// @access  Private
exports.updateSettings = async (req, res) => {
    try {
        let settings = await CompanySettings.findOne();
        if (!settings) {
            settings = new CompanySettings(req.body);
            await settings.save();
        } else {
            const updateData = { ...req.body };
            delete updateData._id;
            delete updateData.createdAt;
            delete updateData.updatedAt;
            delete updateData.__v;
            
            settings.set(updateData);
            settings.markModified('salesPersons');
            await settings.save();
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
