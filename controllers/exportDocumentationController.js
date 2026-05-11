const path = require('path');
const fs = require('fs');
const ExportDocumentation = require('../models/ExportDocumentation');

// @desc    Get all shipments
// @route   GET /api/export-documentation
// @access  Private
exports.getAllShipments = async (req, res) => {
    try {
        const shipments = await ExportDocumentation.find().sort({ createdAt: -1 });
        res.json(shipments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Initialize new shipment
// @route   POST /api/export-documentation
// @access  Private
exports.createShipment = async (req, res) => {
    try {
        const { shipmentId, dispatchId, customer, destination, documents, status } = req.body;
        const userId = req.user.userId;

        const shipment = new ExportDocumentation({
            shipmentId,
            dispatchId,
            customer,
            destination,
            documents,
            status,
            userId
        });

        await shipment.save();
        res.status(201).json(shipment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update document status
// @route   PATCH /api/export-documentation/:id
// @access  Private
exports.updateShipment = async (req, res) => {
    try {
        const { dispatchId, customer, destination, documents, status } = req.body;
        const shipment = await ExportDocumentation.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        if (dispatchId) shipment.dispatchId = dispatchId;
        if (customer) shipment.customer = customer;
        if (destination) shipment.destination = destination;
        if (status) shipment.status = status;
        if (documents) shipment.documents = documents;

        await shipment.save();
        res.json(shipment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Upload document
// @route   POST /api/export-documentation/upload/:id/:docKey
// @access  Private
exports.uploadDocument = async (req, res) => {
    try {
        const { id, docKey } = req.params;
        const shipment = await ExportDocumentation.findById(id);

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Update document status and path
        if (!shipment.documents) shipment.documents = {};

        const filePath = `/uploads/${req.file.filename}`;
        shipment.documents[docKey] = filePath;

        shipment.markModified('documents');

        await shipment.save();
        res.json({ message: 'Document uploaded successfully', filePath, shipment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete document
// @route   DELETE /api/export-documentation/document/:id/:docKey
// @access  Private
exports.deleteDocument = async (req, res) => {
    try {
        const { id, docKey } = req.params;
        const shipment = await ExportDocumentation.findById(id);

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        const filePath = shipment.documents[docKey];
        if (filePath && filePath.startsWith('/uploads/')) {
            const fullPath = path.join(__dirname, '..', filePath);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }

        shipment.documents[docKey] = 'Pending';
        shipment.markModified('documents');

        await shipment.save();
        res.json({ message: 'Document deleted successfully', shipment });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
