const AssayingTesting = require('../models/AssayingTesting');

// @desc    Get all test samples
// @route   GET /api/assaying-testing
// @access  Private
exports.getAllSamples = async (req, res) => {
    try {
        const samples = await AssayingTesting.find().sort({ createdAt: -1 });
        res.json(samples);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new test sample
// @route   POST /api/assaying-testing
// @access  Private
exports.createSample = async (req, res) => {
    try {
        const {
            sampleId,
            batchId,
            linkedBatch,
            supplierName,
            customerName,
            testType,
            labName,
            mineralType,
            purity,
            submittedDate,
            resultDate,
            status
        } = req.body;

        const userId = req.user.userId;

        const sample = new AssayingTesting({
            sampleId,
            batchId: batchId || linkedBatch,
            supplierName,
            customerName,
            testType,
            labName,
            mineralType,
            purity,
            submittedDate,
            resultDate,
            status,
            userId
        });

        await sample.save();
        res.status(201).json(sample);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update test result or status
// @route   PATCH /api/assaying-testing/:id
// @access  Private
exports.updateSample = async (req, res) => {
    try {
        const { status, purity, testType, labName, resultDate, supplierName, customerName } = req.body;
        const sample = await AssayingTesting.findById(req.params.id);

        if (!sample) {
            return res.status(404).json({ message: 'Sample not found' });
        }

        if (status) sample.status = status;
        if (purity !== undefined) sample.purity = purity;
        if (testType !== undefined) sample.testType = testType;
        if (labName !== undefined) sample.labName = labName;
        if (resultDate !== undefined) sample.resultDate = resultDate;
        if (supplierName !== undefined) sample.supplierName = supplierName;
        if (customerName !== undefined) sample.customerName = customerName;

        await sample.save();
        res.json(sample);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
