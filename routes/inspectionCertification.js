const express = require('express');
const router = express.Router();
const inspectionCertificationController = require('../controllers/inspectionCertificationController');

// Get all inspections
router.get('/', inspectionCertificationController.getAllInspections);

// Schedule new inspection
router.post('/', inspectionCertificationController.createInspection);

// Update inspection observations or status
router.patch('/:id', inspectionCertificationController.updateInspection);

module.exports = router;
