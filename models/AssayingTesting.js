const mongoose = require('mongoose');

const assayingTestingSchema = new mongoose.Schema({
    sampleId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    batchId: {
        type: String,
        required: true
    },
    supplierName: {
        type: String,
        default: 'N/A'
    },
    customerName: {
        type: String,
        default: 'N/A'
    },
    testType: {
        type: String,
        required: true
    },
    labName: {
        type: String,
        required: true
    },
    purity: {
        type: String,
        default: ''
    },
    mineralType: {
        type: [String],
        default: []
    },
    submittedDate: {
        type: String
    },
    resultDate: {
        type: String
    },
    notes: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        default: 'Pending'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AssayingTesting', assayingTestingSchema);
