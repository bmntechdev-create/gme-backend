const InventoryLog = require('../models/InventoryLog');
const YardIntake = require('../models/YardIntake');
const CrushingProcessing = require('../models/CrushingProcessing');
const AssayingTesting = require('../models/AssayingTesting');

// @desc    Get all inventory logs (variance/loss)
// @route   GET /api/inventory/logs
// @access  Private
exports.getAllLogs = async (req, res) => {
    try {
        const logs = await InventoryLog.find().sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new inventory log (variance/loss)
// @route   POST /api/inventory/logs
// @access  Private
exports.createLog = async (req, res) => {
    try {
        const { batchId, inputQty, outputQty, reason } = req.body;
        const userId = req.user.userId;
        const log = new InventoryLog({ batchId, inputQty, outputQty, reason, userId });
        await log.save();
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Trace Detail: Aggregate data across modules for a Batch ID
// @route   GET /api/inventory/trace/:batchId
// @access  Private
exports.getTraceDetail = async (req, res) => {
    try {
        const { batchId } = req.params;

        // Search across relevant collections
        const [processing, testing, intake] = await Promise.all([
            CrushingProcessing.findOne({ batchId }),
            AssayingTesting.findOne({ linkedBatch: batchId }),
            YardIntake.findOne({ grnNumber: batchId })
        ]);

        res.json({
            batchId,
            processing: processing || null,
            testing: testing || null,
            intake: intake || null
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete inventory log
// @route   DELETE /api/inventory/logs/:id
// @access  Private
exports.deleteLog = async (req, res) => {
    try {
        const log = await InventoryLog.findByIdAndDelete(req.params.id);
        if (!log) {
            return res.status(404).json({ message: 'Log not found' });
        }
        res.json({ message: 'Log deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
