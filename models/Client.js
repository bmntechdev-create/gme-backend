const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    tin: { type: String, required: false, unique: true, sparse: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    registrationDate: { type: String, required: true },
    status: {
        type: String,
        enum: ['Active', 'Onboarding', 'Inactive'],
        default: 'Onboarding'
    },
    primaryContact: { type: String, required: true },
    industry: { type: String, required: true },
    type: {
        type: String,
        enum: ['Supplier', 'Customer', 'Both'],
        default: 'Supplier'
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Client', clientSchema);
