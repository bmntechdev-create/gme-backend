const Transporter = require('../models/Transporter');
const TripAssignment = require('../models/TripAssignment');

// --- Transporter Controllers ---

// @desc    Get all transporters
// @route   GET /api/transportation/transporters
// @access  Private
exports.getAllTransporters = async (req, res) => {
    try {
        const transporters = await Transporter.find().sort({ companyName: 1 });
        res.json(transporters);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Add new transporter
// @route   POST /api/transportation/transporters
// @access  Private
exports.createTransporter = async (req, res) => {
    try {
        const { companyName, contactPerson, phone, email, gstNumber } = req.body;
        const userId = req.user.userId;
        const transporter = new Transporter({ companyName, contactPerson, phone, email, gstNumber, userId });
        await transporter.save();
        res.status(201).json(transporter);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// --- Trip Assignment Controllers ---

// @desc    Get all trip assignments
// @route   GET /api/transportation/trips
// @access  Private
exports.getAllTrips = async (req, res) => {
    try {
        const trips = await TripAssignment.find().populate('transporterId').sort({ createdAt: -1 });
        const mappedTrips = trips.map(t => {
            const tripObj = t.toObject();
            if (tripObj.transporterId) {
                tripObj.transporterId.name = tripObj.transporterId.companyName;
            }
            return tripObj;
        });
        res.json(mappedTrips);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create new trip assignment
// @route   POST /api/transportation/trips
// @access  Private
exports.createTrip = async (req, res) => {
    try {
        const { tripId, transporterId, dispatchId, route, freightAmount, startDate, endDate, status } = req.body;
        const userId = req.user.userId;
        const trip = new TripAssignment({ tripId, transporterId, dispatchId, route, freightAmount, startDate, endDate, status, userId });
        await trip.save();
        res.status(201).json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update trip assignment
// @route   PATCH /api/transportation/trips/:id
// @access  Private
exports.updateTrip = async (req, res) => {
    try {
        const { transporterId, dispatchId, route, freightAmount, startDate, endDate, status } = req.body;
        const trip = await TripAssignment.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        if (transporterId) trip.transporterId = transporterId;
        if (dispatchId) trip.dispatchId = dispatchId;
        if (route) trip.route = route;
        if (freightAmount !== undefined) trip.freightAmount = freightAmount;
        if (startDate) trip.startDate = startDate;
        if (endDate) trip.endDate = endDate;
        if (status) trip.status = status;

        await trip.save();
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
