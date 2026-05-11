const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema({
    batchId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    inputQty: {
        type: Number,
        required: true
    },
    outputQty: {
        type: Number,
        required: true
    },
    lossWeight: {
        type: Number
    },
    reason: {
        type: String,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Auto-calculate loss weight before saving
inventoryLogSchema.pre('save', async function () {
    this.lossWeight = this.inputQty - this.outputQty;
});

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);
