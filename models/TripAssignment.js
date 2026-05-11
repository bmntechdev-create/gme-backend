const mongoose = require('mongoose');

const tripAssignmentSchema = new mongoose.Schema({
    tripId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    transporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transporter',
        required: true
    },
    dispatchId: {
        type: String,
        required: true
    },
    route: {
        type: String,
        required: true,
        trim: true
    },
    freightAmount: {
        type: Number,
        required: true
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
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

module.exports = mongoose.model('TripAssignment', tripAssignmentSchema);
