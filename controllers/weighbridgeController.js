const Weighbridge = require('../models/Weighbridge');

// @desc    Get all weighbridge logs
// @route   GET /api/weighbridge
// @access  Private
exports.getAllLogs = async (req, res) => {
    try {
        const logs = await Weighbridge.find().sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new weighbridge log (Inbound or Outbound)
// @route   POST /api/weighbridge
// @access  Private
exports.createLog = async (req, res) => {
    try {
        const {
            vehicleNo,
            type,
            status,
            supplierName,
            grossWeight,
            tareWeight,
            netWeight,
            destination,
            loadedWeight,
            dateTime
        } = req.body;

        const userId = req.user.userId;

        const log = new Weighbridge({
            vehicleNo,
            type,
            status,
            supplierName,
            grossWeight,
            tareWeight,
            netWeight,
            destination,
            loadedWeight,
            dateTime,
            userId
        });

        await log.save();
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
