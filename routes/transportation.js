const express = require('express');
const router = express.Router();
const transportationController = require('../controllers/transportationController');

// --- Transporter Routes ---
router.get('/transporters', transportationController.getAllTransporters);
router.post('/transporters', transportationController.createTransporter);

// --- Trip Assignment Routes ---
router.get('/trips', transportationController.getAllTrips);
router.post('/trips', transportationController.createTrip);
router.patch('/trips/:id', transportationController.updateTrip);

module.exports = router;
