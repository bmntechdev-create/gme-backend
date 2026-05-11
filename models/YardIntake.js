const mongoose = require('mongoose');

const yardIntakeSchema = new mongoose.Schema({
    supplierName: {
        type: String,
        required: true,
        trim: true
    },
    customerName: {
        type: String,
        default: 'N/A',
        trim: true
    },
    vehicleNumber: {
        type: String,
        required: true,
        trim: true
    },
    materialType: [{
        name: String,
        grossWeight: Number,
        tareWeight: Number,
        netWeight: Number
    }],
    grossWeight: {
        type: Number,
        required: true
    },
    tareWeight: {
        type: Number,
        required: true
    },
    netWeight: {
        type: Number,
        required: true
    },
    grnNumber: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Paid', 'Pending', 'Completed', 'Refunded'],
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

// Auto-calculate weights before saving
yardIntakeSchema.pre('save', async function () {
    if (this.materialType && this.materialType.length > 0) {
        let totalGross = 0;
        let totalTare = 0;
        let totalNet = 0;

        this.materialType.forEach(item => {
            // Only calculate if weights are provided as numbers
            if (typeof item.grossWeight === 'number' && typeof item.tareWeight === 'number') {
                item.netWeight = item.grossWeight - item.tareWeight;
                totalGross += item.grossWeight;
                totalTare += item.tareWeight;
                totalNet += item.netWeight;
            }
        });

        // Only override top-level weights if we actually summed something up
        if (totalGross > 0 || totalTare > 0) {
            this.grossWeight = totalGross;
            this.tareWeight = totalTare;
            this.netWeight = totalNet;
        } else {
            this.netWeight = this.grossWeight - this.tareWeight;
        }
    } else {
        this.netWeight = this.grossWeight - this.tareWeight;
    }
});

module.exports = mongoose.model('YardIntake', yardIntakeSchema);
