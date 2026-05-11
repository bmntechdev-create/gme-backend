const mongoose = require('mongoose');

const inspectionCertificationSchema = new mongoose.Schema({
    inspectionId: {
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
    inspectorName: {
        type: String,
        required: true
    },
    inspectionType: {
        type: String,
        required: true
    },
    scheduledDate: {
        type: String,
        required: true
    },
    completedDate: {
        type: String
    },
    observations: {
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

module.exports = mongoose.model('InspectionCertification', inspectionCertificationSchema);
