const mongoose = require('mongoose');

const loadingDispatchSchema = new mongoose.Schema({
    dispatchId: {
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
    containerNumber: {
        type: String,
        required: true,
        trim: true
    },
    loadingWeight: {
        type: Number,
        required: true
    },
    destination: {
        type: String,
        required: true,
        trim: true
    },
    dispatchDate: {
        type: String,
        required: true
    },
    deliveryDate: {
        type: String
    },
    driverName: {
        type: String,
        trim: true
    },
    contactNumber: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        default: 'Loaded'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('LoadingDispatch', loadingDispatchSchema);
