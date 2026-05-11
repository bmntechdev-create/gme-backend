const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    total: { type: Number }
});

const quotationSchema = new mongoose.Schema({
    quotationNo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        trim: true
    },
    salesPerson: {
        type: String,
        trim: true
    },
    dateTime: {
        type: String,
        required: true
    },
    validUntil: {
        type: String
    },
    currency: {
        type: String,
        default: 'USD'
    },
    lineItems: [lineItemSchema],
    amount: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number
    },
    taxAmount: {
        type: Number
    },
    discountAmount: {
        type: Number
    },
    status: {
        type: String,
        default: 'Draft'
    },
    notes: {
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

// Auto-calculate line item totals
quotationSchema.pre('save', async function () {
    if (this.lineItems && this.lineItems.length > 0) {
        let calculatedTotal = 0;
        this.lineItems.forEach(item => {
            if (item.quantity && item.rate) {
                item.total = item.quantity * item.rate;
                calculatedTotal += item.total;
            }
        });
        // We only set this.amount if it's not already set by frontend
        if (!this.amount) {
            this.amount = calculatedTotal + (this.taxAmount || 0) - (this.discountAmount || 0);
        }
    }
});

module.exports = mongoose.model('Quotation', quotationSchema);
