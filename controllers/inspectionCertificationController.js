const InspectionCertification = require('../models/InspectionCertification');

// @desc    Get all inspections
// @route   GET /api/inspection-certification
// @access  Private
exports.getAllInspections = async (req, res) => {
    try {
        const inspections = await InspectionCertification.find().sort({ createdAt: -1 });
        res.json(inspections);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Schedule new inspection
// @route   POST /api/inspection-certification
// @access  Private
exports.createInspection = async (req, res) => {
    try {
        const {
            inspectionId,
            batchId,
            supplierName,
            customerName,
            inspectorName,
            inspectionType,
            scheduledDate,
            completedDate,
            observations,
            status
        } = req.body;

        const userId = req.user.userId;

        const inspection = new InspectionCertification({
            inspectionId,
            batchId,
            supplierName,
            customerName,
            inspectorName,
            inspectionType,
            scheduledDate,
            completedDate,
            observations,
            status,
            userId
        });

        await inspection.save();
        res.status(201).json(inspection);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update inspection observations or status
// @route   PATCH /api/inspection-certification/:id
// @access  Private
exports.updateInspection = async (req, res) => {
    try {
        const { status, observations, completedDate, supplierName, customerName } = req.body;
        const inspection = await InspectionCertification.findById(req.params.id);

        if (!inspection) {
            return res.status(404).json({ message: 'Inspection not found' });
        }

        if (status) inspection.status = status;
        if (observations !== undefined) inspection.observations = observations;
        if (completedDate !== undefined) inspection.completedDate = completedDate;
        if (supplierName !== undefined) inspection.supplierName = supplierName;
        if (customerName !== undefined) inspection.customerName = customerName;

        await inspection.save();
        res.json(inspection);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
