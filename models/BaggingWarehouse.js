const mongoose = require('mongoose');

const baggingWarehouseSchema = new mongoose.Schema({
    baggingId: {
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
    numberOfBags: {
        type: Number,
        required: true
    },
    weightPerBag: {
        type: Number,
        default: 50
    },
    totalWeight: {
        type: Number,
        required: true
    },
    warehouseLocation: {
        type: String,
        required: true
    },
    baggingDate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Completed', 'Pending'],
        default: 'Completed'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Auto-calculate total weight before saving
baggingWarehouseSchema.pre('save', async function () {
    this.totalWeight = this.numberOfBags * this.weightPerBag;
});

module.exports = mongoose.model('BaggingWarehouse', baggingWarehouseSchema);
