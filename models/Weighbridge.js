const mongoose = require('mongoose');

const weighbridgeSchema = new mongoose.Schema({
    vehicleNo: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Completed'
    },
    // Inbound specific
    supplierName: {
        type: String,
        trim: true
    },
    grossWeight: {
        type: Number
    },
    tareWeight: {
        type: Number
    },
    netWeight: {
        type: Number
    },
    // Outbound specific
    destination: {
        type: String,
        trim: true
    },
    loadedWeight: {
        type: Number
    },
    dateTime: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Auto-calculate net weight for inbound before saving
weighbridgeSchema.pre('save', async function () {
    if (this.type === 'Inbound' && this.grossWeight && this.tareWeight) {
        this.netWeight = this.grossWeight - this.tareWeight;
    }
});

module.exports = mongoose.model('Weighbridge', weighbridgeSchema);
