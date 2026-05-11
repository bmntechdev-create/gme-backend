const mongoose = require('mongoose');

const companySettingsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    rcNumber: { type: String, required: true },
    tin: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    logo: { type: String },
    vatPercentage: { type: Number, default: 7.5 },
    defaultDiscountType: { type: String, enum: ['Percentage', 'Fixed'], default: 'Percentage' },
    defaultDiscountValue: { type: Number, default: 0 },
    materialTypes: { type: [String], default: [] },
    laboratories: { type: [String], default: [] },
    inspectionTypes: { type: [String], default: [] },
    machines: { type: [String], default: [] },
    vehicles: { type: [String], default: [] },
    inspectors: { type: [String], default: [] },
    destinations: { type: [String], default: [] },
    warehouses: { type: [String], default: [] },
    salesPersons: { type: [String], default: [] },
    currency: { type: String, default: 'AED' }
}, { timestamps: true });

// We only ever want one document for company settings
module.exports = mongoose.model('CompanySettings', companySettingsSchema);
