const LoadingDispatch = require('../models/LoadingDispatch');
const CrushingProcessing = require('../models/CrushingProcessing');
const YardIntake = require('../models/YardIntake');

// @desc    Get all dispatch records
// @route   GET /api/loading-dispatch
// @access  Private
exports.getAllDispatches = async (req, res) => {
    try {
        const dispatches = await LoadingDispatch.find().sort({ createdAt: -1 });
        res.json(dispatches);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new dispatch record
// @route   POST /api/loading-dispatch
// @access  Private
exports.createDispatch = async (req, res) => {
    try {
        const {
            dispatchId,
            batchId,
            supplierName,
            customerName,
            containerNumber,
            loadingWeight,
            destination,
            dispatchDate,
            deliveryDate,
            driverName,
            contactNumber,
            status
        } = req.body;

        const userId = req.user.userId;

        const dispatch = new LoadingDispatch({
            dispatchId,
            batchId,
            supplierName,
            customerName,
            containerNumber,
            loadingWeight,
            destination,
            dispatchDate,
            deliveryDate,
            driverName,
            contactNumber,
            status: status || 'Loaded',
            userId
        });

        await dispatch.save();

        // Automatically update the source Yard Intake record to 'Completed'
        try {
            const batch = await CrushingProcessing.findOne({ batchId });
            if (batch && batch.grnReference && batch.grnReference !== 'N/A') {
                await YardIntake.findOneAndUpdate(
                    { grnNumber: batch.grnReference },
                    { status: 'Completed' }
                );
            }
        } catch (updateError) {
            console.error('Error updating Yard Intake status during dispatch creation:', updateError);
            // We don't fail the dispatch creation if the status update fails
        }

        res.status(201).json(dispatch);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update dispatch status
// @route   PATCH /api/loading-dispatch/:id
// @access  Private
exports.updateDispatch = async (req, res) => {
    try {
        const { status, containerNumber, loadingWeight, destination, deliveryDate, supplierName, customerName } = req.body;
        const dispatch = await LoadingDispatch.findById(req.params.id);

        if (!dispatch) {
            return res.status(404).json({ message: 'Dispatch not found' });
        }

        if (status) dispatch.status = status;
        if (containerNumber) dispatch.containerNumber = containerNumber;
        if (loadingWeight) dispatch.loadingWeight = loadingWeight;
        if (destination) dispatch.destination = destination;
        if (deliveryDate) dispatch.deliveryDate = deliveryDate;
        if (supplierName !== undefined) dispatch.supplierName = supplierName;
        if (customerName !== undefined) dispatch.customerName = customerName;

        await dispatch.save();
        res.json(dispatch);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete dispatch record
// @route   DELETE /api/loading-dispatch/:id
// @access  Private
exports.deleteDispatch = async (req, res) => {
    try {
        const dispatch = await LoadingDispatch.findByIdAndDelete(req.params.id);
        if (!dispatch) {
            return res.status(404).json({ message: 'Dispatch not found' });
        }
        res.json({ message: 'Dispatch deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
