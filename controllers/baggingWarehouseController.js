const BaggingWarehouse = require('../models/BaggingWarehouse');

// @desc    Get all bagging entries
// @route   GET /api/bagging-warehouse
// @access  Private
exports.getAllEntries = async (req, res) => {
    try {
        const entries = await BaggingWarehouse.find().sort({ createdAt: -1 });
        res.json(entries);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new bagging entry
// @route   POST /api/bagging-warehouse
// @access  Private
exports.createEntry = async (req, res) => {
    try {
        const {
            baggingId,
            batchId,
            supplierName,
            customerName,
            numberOfBags,
            weightPerBag,
            warehouseLocation,
            baggingDate,
            status
        } = req.body;

        const userId = req.user.userId;

        const totalWeight = numberOfBags * (weightPerBag || 50);

        const entry = new BaggingWarehouse({
            baggingId,
            batchId,
            supplierName,
            customerName,
            numberOfBags,
            weightPerBag: weightPerBag || 50,
            totalWeight,
            warehouseLocation,
            baggingDate,
            status: status || 'Completed',
            userId
        });

        await entry.save();
        res.status(201).json(entry);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update bagging entry
// @route   PATCH /api/bagging-warehouse/:id
// @access  Private
exports.updateEntry = async (req, res) => {
    try {
        const { numberOfBags, weightPerBag, warehouseLocation, status, supplierName, customerName } = req.body;
        const entry = await BaggingWarehouse.findById(req.params.id);

        if (!entry) {
            return res.status(404).json({ message: 'Bagging record not found' });
        }

        if (numberOfBags !== undefined) {
            entry.numberOfBags = numberOfBags;
            entry.totalWeight = numberOfBags * (weightPerBag || entry.weightPerBag);
        }
        if (weightPerBag !== undefined) entry.weightPerBag = weightPerBag;
        if (warehouseLocation !== undefined) entry.warehouseLocation = warehouseLocation;
        if (status !== undefined) entry.status = status;
        if (supplierName !== undefined) entry.supplierName = supplierName;
        if (customerName !== undefined) entry.customerName = customerName;

        await entry.save();
        res.json(entry);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete bagging entry
// @route   DELETE /api/bagging-warehouse/:id
// @access  Private
exports.deleteEntry = async (req, res) => {
    try {
        const entry = await BaggingWarehouse.findByIdAndDelete(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: 'Bagging record not found' });
        }
        res.json({ message: 'Bagging record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
