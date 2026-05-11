const YardIntake = require('../models/YardIntake');

// @desc    Get all Yard Intake records
// @route   GET /api/yard-intake
// @access  Private
exports.getAllIntakes = async (req, res) => {
    try {
        const records = await YardIntake.find().sort({ createdAt: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new Yard Intake record
// @route   POST /api/yard-intake
// @access  Private
exports.createIntake = async (req, res) => {
    try {
        const {
            supplierName,
            supplier,
            vehicleNumber,
            materialType,
            mineralType,
            grossWeight,
            tareWeight,
            grnNumber,
            status,
            customerName
        } = req.body;

        const userId = req.user.userId;

        // console.log('Incoming materialType:', materialType || mineralType);
        let rawMaterials = materialType || mineralType;
        
        // If it's a string that looks like a JS array literal (from a potential copy-paste error)
        if (typeof rawMaterials === 'string' && rawMaterials.trim().startsWith('[')) {
            try {
                // Try to clean it up if it's JSON
                rawMaterials = JSON.parse(rawMaterials);
            } catch (e) {
                console.error('Failed to parse materialType string:', e.message);
                // If it's not JSON, it might be the literal string from the error message
                // We'll try to see if it's just a legacy single material name
                rawMaterials = [rawMaterials];
            }
        }

        let finalMaterials = [];
        if (Array.isArray(rawMaterials)) {
            finalMaterials = rawMaterials.map(m => {
                if (typeof m === 'string') {
                    // Check if the string itself is a JSON object
                    if (m.trim().startsWith('{')) {
                        try { return JSON.parse(m); } catch (e) {}
                    }
                    return { name: m, grossWeight: 0, tareWeight: 0, netWeight: 0 };
                }
                return m;
            });
        }

        let finalGross = grossWeight || 0;
        let finalTare = tareWeight || 0;
        let finalNet = 0;

        if (finalMaterials.length > 0 && typeof finalMaterials[0] === 'object') {
            finalGross = finalMaterials.reduce((sum, item) => sum + (parseFloat(item.grossWeight) || 0), 0);
            finalTare = finalMaterials.reduce((sum, item) => sum + (parseFloat(item.tareWeight) || 0), 0);
            finalNet = finalGross - finalTare;
        } else {
            finalNet = finalGross - finalTare;
        }

        const generatedGrn = grnNumber || `GRN-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const record = new YardIntake({
            supplierName: supplierName || supplier,
            vehicleNumber,
            materialType: finalMaterials,
            grossWeight: finalGross,
            tareWeight: finalTare,
            netWeight: finalNet,
            grnNumber: generatedGrn,
            status: status || 'Pending',
            customerName: customerName || 'N/A',
            userId
        });

        await record.save();
        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update Yard Intake record
// @route   PATCH /api/yard-intake/:id
// @access  Private
exports.updateIntake = async (req, res) => {
    try {
        const {
            supplierName,
            vehicleNumber,
            materialType,
            grossWeight,
            tareWeight,
            grnNumber,
            status,
            customerName
        } = req.body;

        const record = await YardIntake.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (supplierName) record.supplierName = supplierName;
        if (vehicleNumber) record.vehicleNumber = vehicleNumber;
        if (materialType) record.materialType = materialType;
        if (grossWeight !== undefined) record.grossWeight = grossWeight;
        if (tareWeight !== undefined) record.tareWeight = tareWeight;
        if (grnNumber) record.grnNumber = grnNumber;
        if (status) record.status = status;
        if (customerName) record.customerName = customerName;

        // Convert legacy materials if necessary
        if (materialType && Array.isArray(materialType)) {
            record.materialType = materialType.map(m => {
                if (typeof m === 'string') {
                    return { name: m, grossWeight: 0, tareWeight: 0, netWeight: 0 };
                }
                return m;
            });
        }

        // Recalculate weights
        if (record.materialType && record.materialType.length > 0 && typeof record.materialType[0] === 'object') {
            record.grossWeight = record.materialType.reduce((sum, item) => sum + (parseFloat(item.grossWeight) || 0), 0);
            record.tareWeight = record.materialType.reduce((sum, item) => sum + (parseFloat(item.tareWeight) || 0), 0);
            record.netWeight = record.grossWeight - record.tareWeight;
        } else if (grossWeight !== undefined || tareWeight !== undefined) {
            record.netWeight = record.grossWeight - record.tareWeight;
        }

        await record.save();
        res.json(record);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete Yard Intake record
// @route   DELETE /api/yard-intake/:id
// @access  Private
exports.deleteIntake = async (req, res) => {
    try {
        const record = await YardIntake.findByIdAndDelete(req.params.id);
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.json({ message: 'Record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
