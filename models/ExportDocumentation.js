const mongoose = require('mongoose');

const exportDocumentationSchema = new mongoose.Schema({
    shipmentId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    dispatchId: {
        type: String,
        trim: true
    },
    customer: {
        type: String,
        required: true,
        trim: true
    },
    destination: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        default: 'In Progress'
    },
    documents: {
        commercialInvoice: { type: String, default: 'Pending' },
        packingList: { type: String, default: 'Pending' },
        certificateOfOrigin: { type: String, default: 'Pending' },
        inspectionCert: { type: String, default: 'Pending' },
        billOfLading: { type: String, default: 'Pending' },
        customsDocs: { type: String, default: 'Pending' }
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ExportDocumentation', exportDocumentationSchema);
