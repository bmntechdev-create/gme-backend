const express = require('express');
const router = express.Router();
const crushingProcessingController = require('../controllers/crushingProcessingController');

// Get all Crushing & Processing batches
router.get('/', crushingProcessingController.getAllBatches);

// Create new Crushing & Processing batch
router.post('/', crushingProcessingController.createBatch);

// Update batch details
router.patch('/:id', crushingProcessingController.updateBatch);

// Delete batch
router.delete('/:id', crushingProcessingController.deleteBatch);

module.exports = router;
