const CrushingProcessing = require('../models/CrushingProcessing');

// @desc    Get all Crushing & Processing batches
// @route   GET /api/crushing-processing
// @access  Private
exports.getAllBatches = async (req, res) => {
    try {
        const batches = await CrushingProcessing.find().sort({ createdAt: -1 });
        res.json(batches);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new Crushing & Processing batch
// @route   POST /api/crushing-processing
// @access  Private
exports.createBatch = async (req, res) => {
    try {
        const {
            batchId,
            rawMaterial,
            inputQuantity,
            machineAssigned,
            machine,
            outputGrade,
            processingDate,
            supplierName,
            customerName,
            grnReference
        } = req.body;

        const userId = req.user.userId;

        const batch = new CrushingProcessing({
            batchId,
            rawMaterial,
            inputQuantity,
            machineAssigned: machineAssigned || machine,
            outputGrade,
            processingDate,
            supplierName,
            customerName,
            grnReference,
            userId
        });

        await batch.save();
        res.status(201).json(batch);
    } catch (error) {
        console.error('Error in batch creation:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message,
            details: error.errors
        });
    }
};

// @desc    Update batch details
// @route   PATCH /api/crushing-processing/:id
// @access  Private
exports.updateBatch = async (req, res) => {
    try {
        const batch = await CrushingProcessing.findById(req.params.id);

        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        // List of updatable fields
        const updatableFields = [
            'status', 'outputQuantity', 'machineAssigned', 'rawMaterial',
            'inputQuantity', 'outputGrade', 'processingDate', 'operator',
            'supervisor', 'equipmentUsed', 'processStages',
            'qualityParameters', 'sizeDistribution', 'qualityApproved',
            'supplierName', 'customerName', 'grnReference'
        ];

        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                batch[field] = req.body[field];
            }
        });

        await batch.save();
        res.json(batch);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
