const mongoose = require('mongoose');

const crushingProcessingSchema = new mongoose.Schema({
    batchId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    rawMaterial: {
        type: [String],
        required: true
    },
    inputQuantity: {
        type: Number,
        required: true
    },
    machineAssigned: {
        type: String,
        required: true
    },
    outputGrade: {
        type: String,
        required: true
    },
    outputQuantity: {
        type: Number,
        default: 0
    },
    processingDate: {
        type: Date,
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
    grnReference: {
        type: String,
        default: 'N/A'
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Completed'],
        default: 'Pending'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    operator: {
        type: String,
        default: 'N/A'
    },
    supervisor: {
        type: String,
        default: 'N/A'
    },
    equipmentUsed: [String],
    processStages: [{
        stage: String,
        startTime: String,
        endTime: String,
        duration: String,
        status: {
            type: String,
            default: 'Pending'
        }
    }],
    qualityParameters: [{
        parameter: String,
        specification: String,
        actual: String,
        status: {
            type: String,
            default: 'Pass'
        }
    }],
    sizeDistribution: [{
        size: String,
        percentage: Number,
        weight: Number
    }],
    qualityApproved: {
        isApproved: {
            type: Boolean,
            default: false
        },
        approvedBy: String,
        approvalDate: Date,
        remarks: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CrushingProcessing', crushingProcessingSchema);
