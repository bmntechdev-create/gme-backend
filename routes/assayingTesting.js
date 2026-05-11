const express = require('express');
const router = express.Router();
const assayingTestingController = require('../controllers/assayingTestingController');

// Get all test samples
router.get('/', assayingTestingController.getAllSamples);

// Create new test sample
router.post('/', assayingTestingController.createSample);

// Update test result or status
router.patch('/:id', assayingTestingController.updateSample);

module.exports = router;
